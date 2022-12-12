export interface PaginationBtn {
    name: string | undefined;
    on_click_page: number;
    page_btn_content: number | React.ReactNode;
    is_active: boolean;
    is_disabled: boolean;
}
