export interface CreateFeedback {
	email: string;
	title: string;
	message: string;
}

export interface UpdateFeedback extends Partial<CreateFeedback> {}
