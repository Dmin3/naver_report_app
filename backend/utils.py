def convert_age_groups(age_groups_list):
    """
    ["10", "20"] 같은 연령대 그룹 리스트를 ["1", "2", "3", "4"] 같은 API 코드 리스트로 변환합니다.
    """
    age_code_map = {
        "10": ["1", "2"],
        "20": ["3", "4"],
        "30": ["5", "6"],
        "40": ["7", "8"],
        "50": ["9", "10"],
        "60": ["11"],
    }

    result_codes = []

    for age_group in age_groups_list:
        codes = age_code_map.get(age_group, [])
        result_codes.extend(codes)

    return result_codes
