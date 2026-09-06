from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Custom DRF exception handler ensuring unified error format compatible with
    SMANV EduERP frontend's extractErrorMessage parser.
    """
    response = exception_handler(exc, context)

    if response is not None:
        data = response.data
        if isinstance(data, dict):
            # If detail is present, also alias message for convenience
            if 'detail' in data and 'message' not in data:
                data['message'] = data['detail']
            elif 'non_field_errors' in data and 'message' not in data:
                nfe = data['non_field_errors']
                data['message'] = nfe[0] if isinstance(nfe, list) and nfe else str(nfe)
            elif 'message' not in data:
                # Find first validation error
                first_key = next(iter(data), None)
                if first_key:
                    first_val = data[first_key]
                    if isinstance(first_val, list) and first_val:
                        data['message'] = f"{first_key.replace('_', ' ').capitalize()}: {first_val[0]}"
                    else:
                        data['message'] = f"{first_key.replace('_', ' ').capitalize()}: {first_val}"

    return response
