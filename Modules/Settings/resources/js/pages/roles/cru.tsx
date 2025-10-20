import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ListPermissionOnMenu, MenuWithPermission, PermissionsOnMenu, RoleData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ChevronUp } from 'lucide-react';
import { ChangeEvent, createContext, useContext, useMemo, useState } from 'react';
import RoleController from '../../../../../../resources/js/actions/Modules/Settings/Http/Controllers/RoleController';
import { SharedData } from '../../../../../../resources/js/types';

type FormDataType = {
    name: string;
    guard_name: string;
    permissions: string[];
};

type setDataByObject<TForm> = (data: TForm) => void;
type setDataByMethod<TForm> = (data: (previousData: TForm) => TForm) => void;
type setDataByKeyValuePair<TForm> = <K extends keyof TForm>(key: K, value: TForm[K]) => void;

type PermssionContextStateType = {
    setData: setDataByObject<FormDataType> & setDataByMethod<FormDataType> & setDataByKeyValuePair<FormDataType>;
    data: FormDataType;
};

const PermissionContext = createContext<PermssionContextStateType>(undefined!);

const Cru = ({ role }: { role?: RoleData }) => {
    const { type, listMenuWithPermission } = usePage<SharedData>().props;

    const getCheckedPermissions = useMemo(
        () =>
            listMenuWithPermission.flatMap((item) =>
                item.permissions.flatMap((permission) =>
                    permission.listPermission.filter((permissionItem) => permissionItem.isCheck).map((permissionItem) => permissionItem.value),
                ),
            ),
        [listMenuWithPermission],
    );

    const { data, setData, post, put, processing, errors, reset } = useForm<FormDataType>({
        name: role?.name || '',
        guard_name: role?.guard_name || 'web',
        permissions: getCheckedPermissions || [],
    });

    const handleInputRoleName = (e: ChangeEvent<HTMLInputElement>) => {
        setData('name', e.target.value.toLowerCase());
    };

    const handleSubmit = (createAnother: boolean = false) => {
        if (!role) return;
        const method = type === 'edit' ? put : post;
        const url =
            type === 'edit' ? RoleController.update.url({ id: role.id }) : RoleController.store.url({ query: { create_another: createAnother } });

        method(url, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                reset();
            },
        });
    };

    const stateForPermissionContext = {
        setData,
        data,
    };

    return (
        <form>
            <CardContent>
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            Role Name <span className="text-red-400">*</span>
                        </Label>
                        <Input id="name" type="text" value={data.name} onChange={handleInputRoleName} required disabled={type === 'show'} />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="guard_name">Guard</Label>
                        <Input
                            id="guard_name"
                            type="text"
                            value={data.guard_name}
                            onChange={(e) => setData('guard_name', e.target.value)}
                            disabled={type === 'show'}
                        />

                        <InputError message={errors.guard_name} className="mt-2" />
                    </div>
                </div>

                <PermissionContext.Provider value={stateForPermissionContext}>
                    <Permissions />
                </PermissionContext.Provider>
            </CardContent>
            <CardFooter>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={() => (type !== 'show' ? handleSubmit(false) : RoleController.edit.url({ id: role?.id || 1 }))}
                        disabled={processing}
                    >
                        {type === 'edit' && 'Update'}
                        {type === 'create' && 'Simpan'}
                        {type === 'show' && 'Edit'}
                    </Button>
                    {type === 'create' && (
                        <Button type="button" variant="outline" onClick={() => handleSubmit(true)} disabled={processing}>
                            Simpan & Buat Lainnya
                        </Button>
                    )}
                    <Button type="button" variant="secondary" disabled={processing} asChild>
                        <Link href={RoleController.index()}>{type === 'show' ? 'Kembali' : 'Batal'}</Link>
                    </Button>
                </div>
            </CardFooter>
        </form>
    );
};

const Permissions = () => {
    const { data, setData } = useContext(PermissionContext);
    const { listMenuWithPermission, type } = usePage<SharedData>().props;

    const getPermissions = useMemo(
        () => listMenuWithPermission.flatMap((item) => item.permissions.flatMap((permission) => permission.listPermission.map((list) => list.value))),
        [listMenuWithPermission],
    );

    const isSelectAll = useMemo(() => getPermissions.every((value) => data.permissions.includes(value)), [data.permissions]);

    const handleSelectAllToggle = () => {
        if (isSelectAll) {
            setData({
                ...data,
                permissions: data.permissions.filter((permissionValue) => !getPermissions.some((list) => list === permissionValue)),
            });
        } else {
            setData({
                ...data,
                permissions: [...new Set([...data.permissions, ...getPermissions])],
            });
        }
    };

    return (
        <Card className="mt-10">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <CardTitle>Permissions</CardTitle>
                        <CardDescription>List permissions untuk menu-menu yang tersedia di aplikasi</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="guard-all" checked={isSelectAll} onClick={handleSelectAllToggle} disabled={type === 'show'} />
                        <Label htmlFor="guard-all">Guard All</Label>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {listMenuWithPermission.length === 0 ? (
                    <h3 className="text-xl text-gray-500">No permissions available</h3>
                ) : (
                    <div className="grid grid-cols-3 gap-5">
                        {listMenuWithPermission.map((list) => (
                            <ListMenuWithPermissions key={list.id} menuWithPermission={list} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const ListMenuWithPermissions = ({ menuWithPermission: menu }: { menuWithPermission: MenuWithPermission }) => {
    const { data, setData } = useContext(PermissionContext);
    const [isOpen, setIsOpen] = useState(true);
    const { type } = usePage().props;

    const getPermissions = useMemo(
        () => menu.permissions.flatMap((permission: PermissionsOnMenu) => permission.listPermission.map((list) => list.value)),
        [menu],
    );

    const isSelectAll = useMemo(() => getPermissions.every((value) => data.permissions.includes(value)), [data.permissions]);

    const handleSelectAllToggle = () => {
        if (isSelectAll) {
            setData({
                ...data,
                permissions: data.permissions.filter((permissionValue) => !getPermissions.some((list) => list === permissionValue)),
            });
        } else {
            setData({
                ...data,
                permissions: [...new Set([...data.permissions, ...getPermissions])],
            });
        }
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2 rounded-md border px-4 py-3">
            <div className="flex items-center justify-between space-x-4 px-4">
                <div>
                    <h4 className="text-sm font-semibold">{menu.nama}</h4>
                </div>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronUp className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    id={`select-all-permission-on-menu-${menu.nama}`}
                    checked={isSelectAll}
                    onClick={handleSelectAllToggle}
                    disabled={type === 'show'}
                />
                <Label htmlFor={`select-all-permission-on-menu-${menu.nama}`}>Select All</Label>
            </div>
            {menu.permissions.length === 0 ? (
                <div className="rounded-md border px-4 py-3 font-mono text-sm">No permissions available</div>
            ) : (
                <>
                    {menu.permissions.map((permission: PermissionsOnMenu) => (
                        <CollapsibleContent className="space-y-2" key={permission.name}>
                            <PermissionsOnMenuComponent permissionsOnMenu={permission} />
                        </CollapsibleContent>
                    ))}
                </>
            )}
        </Collapsible>
    );
};

const PermissionsOnMenuComponent = ({ permissionsOnMenu: permission }: { permissionsOnMenu: PermissionsOnMenu }) => {
    const { type } = usePage().props;

    const { data, setData } = useContext(PermissionContext);
    const [isOpen, setIsOpen] = useState(true);

    const isSelectAll = useMemo(
        () => permission.listPermission.map((data) => data.value).every((value) => data.permissions.includes(value)),
        [data.permissions],
    );

    const handleSelectAllToggle = () => {
        if (isSelectAll) {
            setData({
                ...data,
                permissions: data.permissions.filter((permissionValue) => !permission.listPermission.some((list) => list.value === permissionValue)),
            });
        } else {
            setData({
                ...data,
                permissions: [...new Set([...data.permissions, ...permission.listPermission.map((list) => list.value)])],
            });
        }
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2 rounded-md border px-4 py-3">
            <div className="flex items-center justify-between space-x-4 px-4">
                <div>
                    <h4 className="text-sm font-semibold">{permission.name}</h4>
                </div>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronUp className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <Button variant={isSelectAll ? 'default' : 'outline'} size="sm" type="button" onClick={handleSelectAllToggle} disabled={type === 'show'}>
                Select All Permission
            </Button>
            <CollapsibleContent className="space-y-2">
                <div className="grid grid-flow-col grid-rows-4 gap-2">
                    {permission.listPermission.map((list) => (
                        <CheckboxPermissions key={list.value} list={list} />
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

const CheckboxPermissions = ({ list }: { list: ListPermissionOnMenu }) => {
    const { type } = usePage().props;

    const { data, setData } = useContext(PermissionContext);

    const handleCheckbox = (state: boolean) => {
        if (state) {
            setData({
                ...data,
                permissions: [...new Set([...data.permissions, list.value])],
            });
        } else {
            setData({
                ...data,
                permissions: data.permissions.filter((permission) => permission !== list.value),
            });
        }
    };

    return (
        <label
            htmlFor={list.value}
            className={cn(
                'flex cursor-pointer items-center space-x-2 rounded-md border px-4 py-3 font-mono text-sm leading-none font-medium has-[:checked]:bg-primary-foreground has-[:checked]:text-primary has-[:checked]:ring-primary',
                type === 'show' && 'cursor-not-allowed opacity-70',
            )}
        >
            <Checkbox id={list.value} checked={data.permissions.includes(list.value)} onCheckedChange={handleCheckbox} disabled={type === 'show'} />
            <span>{list.label}</span>
        </label>
    );
};

export default Cru;
