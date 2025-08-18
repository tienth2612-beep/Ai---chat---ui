import { FilterRequest } from "./api";

export interface QuestionResponse {
    id: number;
    title: string;
    type: number;
    code: string | null;
    status: number;
    createAt: string;
    createBy: number;
    updateAt: string;
    updateBy: number;
    totalCount: number;
}

export interface AnswerResponse {
    id: number;
    questionId: number;
    title: string;
    code: string | null;
    status: number;
    createAt: string;
    createBy: number;
    updateAt: string;
    updateBy: number;
}

export interface QuestionDetailResponse {
    question: QuestionResponse;
    answers: AnswerResponse[] | null;
}

export interface GetQuestionRequest extends FilterRequest {}

export interface GetAnswerRequest extends FilterRequest {
    questionId: number;
}

export interface InitQuestionRequest {
    title: string;
    type: number;
    code: string | null;
    status: number;
}
export interface InitAnswerRequest {
    questionId: number;
    title: string;
    code: string | null;
    status: number;
}
