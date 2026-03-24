import { FilterRequest } from "./api";

export interface CommonGroupQuestionResponse {
    id: number;
    name: string;
    description: string;
    createAt: string;
    createBy: number;
    updateAt: string;
    updateBy: number;
    status: boolean;
    totalCount: number;
}

export interface QuestionResponse {
    id: number;
    title: string;
    type: number;
    code: string | null;
    questionGroup: number;
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
export interface InitGroupRequest {
    name: string;
    description: string;
}
export interface InitAnswerRequest {
    questionId: number;
    title: string;
    code: string | null;
    status: number;
}
