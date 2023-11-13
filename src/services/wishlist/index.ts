import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createObjectParamsForS3 } from "../../helper/createObjectParams";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../configs/s3Config";
import WishlistRepository from "../../repository/wishlist";

class WishlistServiceClass {
  async getWishlistByUserId(userID: string) {
    const result = await WishlistRepository.findWishlistByUserId(userID)

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
  async getWishlistByUserIdPopulated(userID: string) {
    const result = await WishlistRepository.findWishlistByUserIdPopulated(userID);
    console.log({result});
    return {
      success: result ? Object.keys(result).length > 0 : false,
      data: result as any,
    };
  }

  async getThumbnailFromServer(result:any){
    console.log(result);
    
    const data = await Promise.all(
        result && result.courses.map(async (ele: any) => {
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

  async courseExistsInWishlist(courseId: string, wishlist: any) {
    const courseExists = wishlist?.courses?.includes(courseId);
    return { success: courseExists, data: wishlist };
  }

  async addCourseToWishlistInExistingWishlist(courseId: string, wishlist: any) {
    wishlist?.courses?.push(courseId);
    wishlist.totalCourses += 1;
    await wishlist.save();
    return {
      success: wishlist ? Object.keys(wishlist).length > 0 : false,
      data: wishlist as any,
    };
  }

  async addCourseToWishlistInNewWishlist(userId: string, courseId: string) {
    const result = await WishlistRepository.createNewWishlist(userId, courseId);
    return {
      success: result ? Object.keys(result).length > 0 : false,
      data: result as any,
    };
  }

  async removeCourseFromWishlist(wishlist:any,courseId:string){
    const index=wishlist.courses.findIndex((ele:any)=>{
        return String(ele)===courseId
    })

    if(index!=-1){
        wishlist.courses.splice(index,1);
        wishlist.totalCourses-=1;
        await wishlist.save()
    }
    return {
        success: wishlist ? Object.keys(wishlist).length > 0 : false,
        data: wishlist as any,
      };
  }
}

const WishlistService = new WishlistServiceClass();

export default WishlistService;
