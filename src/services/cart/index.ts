import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../configs/s3Config";
import { createObjectParamsForS3 } from "../../helper/createObjectParams";
import CartRepository from "../../repository/cart";

class CartServiceClass {
  async getCartByUserId(userID: string) {
    const result = await CartRepository.findCartByUserId(userID);

    return {
      success: result ? Object.keys(result).length > 0 : false,
      data: result as any,
    };
  }
  async getDPFromServer(params: any) {
    const thumbnailCommand = new GetObjectCommand(params);
    const dpURI = await getSignedUrl(s3Client, thumbnailCommand);
    if (dpURI) {
      return { success: true, data: dpURI };
    }
    return { success: false, data: [] };
  }
  async getCartByUserIdPopulated(userID: string) {
    const result = await CartRepository.findCartByUserIdPopulated(userID);
    console.log({ result });
    return {
      success: result ? Object.keys(result).length > 0 : false,
      data: result as any,
    };
  }

  async getThumbnailFromServer(result: any) {
    console.log(result);

    const data = await Promise.all(
      result &&
        result.courses.map(async (ele: any) => {
          const DpObjectParams = createObjectParamsForS3(ele.thumbnail);
          const thumbnail = await this.getDPFromServer(DpObjectParams);
          return {
            ele,
            thumbnailURL: thumbnail.data,
          };
        })
    );
    if (data.length) {
      return { success: true, data };
    }
    return { success: false, data: [] };
  }

  async courseExistsInCart(courseId: string, cart: any) {
    const courseExists = cart?.courses?.includes(courseId);
    return { success: courseExists, data: cart };
  }

  async addCourseToCartInExistingCart(courseId: string, cart: any) {
    cart?.courses?.push(courseId);
    cart.totalCourses += 1;
    await cart.save();
    return {
      success: cart ? Object.keys(cart).length > 0 : false,
      data: cart as any,
    };
  }

  async addCourseToCartInNewCart(userId: string, courseId: string) {
    const result = await CartRepository.createNewCart(userId, courseId);
    return {
      success: result ? Object.keys(result).length > 0 : false,
      data: result as any,
    };
  }

  async removeCourseFromCart(cartId: any, courseId: string) {
    const result = await CartRepository.removeCourseFromCart(cartId, courseId);
    return {
      success: result ? Object.keys(result).length > 0 : false,
      data: result as any,
    };
  }

  async findByIdPopulated(cartId: string) {
    const result = await CartRepository.findByIdPopulated(cartId);
    return {
      success: result ? Object.keys(result).length > 0 : false,
      data: result as any,
    };
  }

  async removeCart(cartId: string) {
    const result = await CartRepository.removeCart(cartId);
    return {
      success: result ? Object.keys(result).length > 0 : false,
      data: result as any,
    };
  }
}

const CartService = new CartServiceClass();

export default CartService;
