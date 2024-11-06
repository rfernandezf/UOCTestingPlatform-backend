export interface AssessmentExecutionResponse {
    id: number,
    assessment_id: number,
    user_id: number,
    execution_date: number,
    passed_tests: number,
    failed_tests: number,
    log_output: string,
    execution_id: string
}