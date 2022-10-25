package routes

type errorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type successResponse struct {
	Code int         `json:"code"`
	Data interface{} `json:"data"`
}

func jsonError(err error) errorResponse {
	return errorResponse{
		Code:    500,
		Message: err.Error(),
	}
}

func jsonData(data interface{}) successResponse {
	return successResponse{
		Code: 200,
		Data: data,
	}
}
