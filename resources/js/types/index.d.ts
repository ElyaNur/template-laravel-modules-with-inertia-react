import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface Toast {
    success: boolean;
    message: string;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
    type: 'create' | 'edit' | 'show';
    appMenu: AppMenu[];
    menu: MenuData;
    user: UserData;
    role: RoleData;
    agama: AgamaData;
    menus: PaginatedResponse<MenuData>;
    users: PaginatedResponse<UserData>;
    roles: PaginatedResponse<RoleData>;
    subMenus: PaginatedResponse<MenuData>;
    agamas: PaginatedResponse<AgamaData>;
    list_menu: MenuData[];
    list_model: ListData[];
    list_permission: ListData[];
    list_role: ListData[];
    list_agama: ListData[];
    pagination_list_agama: PaginatedMetadata;

    listMenuWithPermission: MenuWithPermission[];

    toast: Toast;
}

export type ListData = {
    value: string;
    label: string;
};

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type AppMenu = {
    title: string;
    isActive?: boolean;
    route?: string;
    items?: {
        title: string;
        route: string;
    }[];
};

export type UseTableReturnType<T> = {
    sorting: ColumnSort[];
    setSorting: Dispatch<SetStateAction<ColumnSort[]>>;
    globalFilter: string | undefined;
    setGlobalFilter: Dispatch<SetStateAction<string>>;
    rowSelection: RowSelectionState;
    setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
    columnVisibility: VisibilityState;
    setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>;
    data: PaginatedResponse<T>;
    isLoading: boolean;
    deleteBulk: (ids: number[]) => void;
    isPendingDeleteBulk: boolean;
    setWithTrashed?: Dispatch<SetStateAction<'without-trashed' | 'with-trashed' | 'only-trashed'>>;
    withTrashed?: 'without-trashed' | 'with-trashed' | 'only-trashed';
};

export type PaginatedResponse<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

export type Link = {
    url: string | null;
    label: string;
    active: boolean;
};

export type MenuData = {
    deleted_at: null | string;
    id: number;
    parent_id: number | null;
    nama: string;
    keterangan: string;
    sort: number;
    icon: string;
    is_active: boolean;
    permissions: string[] | null;
    models: string[] | null;
    created_at: string | null;
    updated_at: string | null;
    nama_url: string;
    permissions_or_models: PermissionOrModel[];
};

export type UserData = {
    id: number;
    name: string;
    username: string;
    email: string | null;
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
    roles?: RoleData[];
};

export type RoleData = {
    id: number;
    name: string;
    guard_name: string;
    permissions?: PermissionData[];
    created_at?: string;
    updated_at?: string;
};

export type MenuWithPermission = {
    permissions: PermissionsOnMenu[];
} & MenuData;

export type PermissionsOnMenu = {
    name: string;
    listPermission: ListPermissionOnMenu[];
};

export type ListPermissionOnMenu = {
    value: string;
    label: string;
    isCheck: boolean;
};

export interface AgamaData {
    id: number;
    nama: string;
    created_at: string;
    updated_at: string;
}
