export interface AssessmentExecutionResponse {
    id: number,
    assessment_id: number,
    user_id: number,
    execution_date: number,
    passed_tests: number,
    failed_tests: number,
    execution_time: number,
    log_output: string,
    execution_id: string
}

export interface AllAssessmentExecutionsResponse {
    assessment_id: number,
    assessment_name: string,
    user_id: number,
    email: string,
    classroom_name: string,
    execution_date: number,
    passed_tests: number,
    failed_tests: number,
}

export interface AllAssessmentExecutions {
    assessment_id: number,
    assessment_name: string,
    user_id: number,
    email: string,
    classroom_name: string,
    execution_date: Date,
    passed_tests: number,
    failed_tests: number,
}