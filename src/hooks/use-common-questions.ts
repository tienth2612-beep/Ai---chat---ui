import { useState, useCallback } from "react";
import { commonQuestionService } from "@/lib/service/commonQuestion.service";
import * as CommonQuestionModel from "@/types/commonQuestion";

export function useCommonQuestions() {
    const [groups, setGroups] = useState<
        CommonQuestionModel.CommonGroupQuestionResponse[]
    >([]);
    const [questions, setQuestions] = useState<
        CommonQuestionModel.QuestionResponse[]
    >([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [questionDetail, setQuestionDetail] =
        useState<CommonQuestionModel.QuestionDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch groups
    const fetchGroups = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await commonQuestionService.getGroups();
            if (res && res.items) {
                setGroups(res.items as any);
            } else {
                console.warn("Unexpected response structure:", res);
                setGroups([]);
            }
        } catch (err: any) {
            setError(err?.message || "Failed to fetch groups");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch paginated questions in a group
    const fetchQuestionsInGroup = useCallback(
        async (
            groupId: number,
            params: Partial<CommonQuestionModel.GetQuestionRequest>
        ) => {
            setLoading(true);
            setError(null);
            try {
                const res = await commonQuestionService.getQuestionsInGroup(
                    groupId,
                    params
                );

                if (res && res.items) {
                    setQuestions(res.items || []);
                    setTotalQuestions(res.totalCount || 0);
                } else {
                    console.warn(
                        "Unexpected questions response structure:",
                        res
                    );
                    setQuestions([]);
                    setTotalQuestions(0);
                }
            } catch (err: any) {
                setError(err?.message || "Failed to fetch questions");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Create or update group
    const saveGroup = useCallback(
        async (
            data: Partial<CommonQuestionModel.InitGroupRequest>,
            id?: number
        ) => {
            setLoading(true);
            setError(null);
            try {
                if (id && id > 0) {
                    return await commonQuestionService.updateGroup(id, data);
                } else {
                    return await commonQuestionService.createGroup(data);
                }
            } catch (err: any) {
                setError(err?.message || "Failed to save group");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Toggle group status
    const toggleGroupStatus = useCallback(
        async (
            id: number,
            data: Partial<CommonQuestionModel.InitGroupRequest>
        ) => {
            setLoading(true);
            setError(null);
            try {
                return await commonQuestionService.toggleGroupStatus(id, data);
            } catch (err: any) {
                setError(err?.message || "Failed to toggle group status");
                throw err;
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
            const res = await commonQuestionService.getQuestionDetail(id);

            if (res && res.data) {
                setQuestionDetail(res.data);
            } else if (res && res.isSuccess && res.data) {
                setQuestionDetail(res.data);
            } else {
                console.warn(
                    "Unexpected question detail response structure:",
                    res
                );
                setQuestionDetail(null);
            }
        } catch (err: any) {
            setError(err?.message || "Failed to fetch question detail");
        } finally {
            setLoading(false);
        }
    }, []);

    // Create or update question
    const saveQuestion = useCallback(
        async (
            groupId: number,
            data: Partial<CommonQuestionModel.InitQuestionRequest>,
            id?: number
        ) => {
            setLoading(true);
            setError(null);
            try {
                if (id && id > 0) {
                    return await commonQuestionService.updateQuestion(id, data);
                } else {
                    return await commonQuestionService.createQuestion(
                        groupId,
                        data
                    );
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
        async (id: number, data: CommonQuestionModel.InitQuestionRequest) => {
            setLoading(true);
            setError(null);
            try {
                return await commonQuestionService.toggleQuestionStatus(
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
            data: CommonQuestionModel.InitAnswerRequest,
            answerId?: number
        ) => {
            setLoading(true);
            setError(null);
            try {
                if (answerId) {
                    return await commonQuestionService.updateAnswer(
                        questionId,
                        answerId,
                        data
                    );
                } else {
                    return await commonQuestionService.initAnswer(
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
            data: CommonQuestionModel.InitAnswerRequest
        ) => {
            setLoading(true);
            setError(null);
            try {
                return await commonQuestionService.toggleAnswerStatus(
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
        groups,
        questions,
        totalQuestions,
        questionDetail,
        loading,
        error,
        fetchGroups,
        fetchQuestionsInGroup,
        fetchQuestionDetail,
        saveGroup,
        toggleGroupStatus,
        saveQuestion,
        toggleQuestionStatus,
        saveAnswer,
        toggleAnswerStatus,
    };
}
