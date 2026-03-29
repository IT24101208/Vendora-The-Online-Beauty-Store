package com.vendora.common;

public final class Constants {

    private Constants() {
    }

    public static final String API_BASE = "/api/v1";
    public static final String AUTH_BASE = API_BASE + "/auth";
    public static final String USER_BASE = API_BASE + "/users";
    public static final String ADMIN_BASE = API_BASE + "/admin";

    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_CUSTOMER = "CUSTOMER";
    public static final String ROLE_SUPPLIER = "SUPPLIER";
    public static final String ROLE_DELIVERY = "DELIVERY";

    public static final String STATUS_ACTIVE = "ACTIVE";
    public static final String STATUS_INACTIVE = "INACTIVE";
    public static final String STATUS_DISABLED = "DISABLED";
    public static final String STATUS_PENDING = "PENDING";

    public static final String SUCCESS = "Success";
    public static final String FAILED = "Failed";

    public static final String DASHBOARD_SUMMARY_RETRIEVED = "Admin dashboard summary retrieved successfully";
    public static final String USER_LIST_RETRIEVED = "User list retrieved successfully";
    public static final String USER_DETAILS_RETRIEVED = "User details retrieved successfully";
}