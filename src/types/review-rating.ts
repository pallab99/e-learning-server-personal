export interface IReviewRating {
  user: string;
  course: string;
  reviewMessage?: string;
  rating: number;
}

export interface IUpdateReview {
  reviewMessage?: string;
  rating?: number;
}
