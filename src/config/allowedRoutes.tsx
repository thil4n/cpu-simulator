const allowedRoutes: Record<string, string[]> = {
    SUPER_ADMINISTRATOR: [
        "home",
        "subjects",
        "class-fees",
        "payments",
        "due-payments",
        "students",
        "teachers",
        "salaries",
        "settings",
    ],
    STUDENT_COORDINATE: [
        "home",
        "subjects",
        "students",
        "teachers",
        "settings",
    ],

    FINANCIAL_COORDINATE: [
        "home",
        "class-fees",
        "payments",
        "due-payments",
        "students",
        "teachers",
        "salaries",
        "settings",
    ],

    TEACHER: ["home", "students", "sessions", "settings"],

    STUDENT: ["home", "explorer", "sessions", "settings"],
};
export default allowedRoutes;
