import { useState, useCallback } from "react";
import { welcomeQuestionService } from "@/lib/service/welcomeQuestion.service";
import * as WelcomeQuestionModel from "@/types/welcomeQuestion";

export function useWelcomeQuestions() {
    const [questions, setQuestions] = useState<
        WelcomeQuestionModel.QuestionResponse[]
    >([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [questionDetail, setQuestionDetail] =
        useState<WelcomeQuestionModel.QuestionDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch paginated questions
    const fetchQuestions = useCallback(
        async (params: Partial<WelcomeQuestionModel.GetQuestionRequest>) => {
            setLoading(true);
            setError(null);
            try {
                const res = await welcomeQuestionService.getQuestions(params);
                if (res && res.items) {
                    setQuestions(res.items || []);
                    setTotalQuestions(res.totalCount || 0);
                }
            } catch (err: any) {
                setError(err?.message || "Failed to fetch questions");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Fetch question detail (with answers)
    const fetchQuestionDetail = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await welcomeQuestionService.getQuestionDetail(id);
            if (res && res.data) setQuestionDetail(res.data);
        } catch (err: any) {
            setError(err?.message || "Failed to fetch question detail");
        } finally {
            setLoading(false);
        }
    }, []);

    // Create or update question
    const saveQuestion = useCallback(
        async (
            data: Partial<WelcomeQuestionModel.InitQuestionRequest>,
            id: number
        ) => {
            setLoading(true);
            setError(null);
            try {
                if (id > 0) {
                    return await welcomeQuestionService.updateQuestion(
                        id,
                        data
                    );
                } else {
                    return await welcomeQuestionService.createQuestion(data);
                }
            } catch (err: any) {
                setError(err?.message || "Failed to save question");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Toggle question status
    const toggleQuestionStatus = useCallback(
        async (id: number, data: WelcomeQuestionModel.InitQuestionRequest) => {
            setLoading(true);
            setError(null);
            try {
                return await welcomeQuestionService.toggleQuestionStatus(
                    id,
                    data
                );
            } catch (err: any) {
                setError(err?.message || "Failed to toggle question status");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Create or update answer
    const saveAnswer = useCallback(
        async (
            questionId: number,
            data: WelcomeQuestionModel.InitAnswerRequest,
            answerId?: number
        ) => {
            setLoading(true);
            setError(null);
            try {
                if (answerId) {
                    return await welcomeQuestionService.updateAnswer(
                        questionId,
                        answerId,
                        data
                    );
                } else {
                    return await welcomeQuestionService.initAnswer(
                        questionId,
                        data
                    );
                }
            } catch (err: any) {
                setError(err?.message || "Failed to save answer");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Toggle answer status
    const toggleAnswerStatus = useCallback(
        async (
            questionId: number,
            answerId: number,
            data: WelcomeQuestionModel.InitAnswerRequest
        ) => {
            setLoading(true);
            setError(null);
            try {
                return await welcomeQuestionService.toggleAnswerStatus(
                    questionId,
                    answerId,
                    data
                );
            } catch (err: any) {
                setError(err?.message || "Failed to toggle answer status");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        questions,
        totalQuestions,
        questionDetail,
        loading,
        error,
        fetchQuestions,
        fetchQuestionDetail,
        saveQuestion,
        toggleQuestionStatus,
        saveAnswer,
        toggleAnswerStatus,
    };
}
