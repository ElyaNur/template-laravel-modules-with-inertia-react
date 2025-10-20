import {
    edit,
    getNextSort as nextSort,
    index,
    store as storeData,
    update as updateData,
} from '@/actions/Modules/Settings/Http/Controllers/MenuController';
import StorePermissionController from '@/actions/Modules/Settings/Http/Controllers/StorePermissionController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { MenuData, SharedData } from '@/types';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle, Plus } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

const resolvePolicyType = (menu?: MenuData): '' | 'models' | 'permissions' | 'permissions_and_models' => {
    if (!menu) return '';
    if (menu.permissions?.length && menu.models?.length) return 'permissions_and_models';
    if (menu.permissions?.length) return 'permissions';
    if (menu.models?.length) return 'models';
    return '';
};

const Cru = ({ menu }: { menu?: MenuData }) => {
    const { list_menu: listMenu, list_model: listModel, list_permission: listPermission, type } = usePage<SharedData>().props;
    const { data, setData, post, put, processing, errors, reset, transform } = useForm<{
        nama: string;
        parent_id: string;
        keterangan: string;
        sort: number;
        icon: string;
        is_active: boolean;
        permissions: string[];
        models: string[];
    }>({
        nama: menu?.nama || '',
        parent_id: String(menu?.parent_id || ''),
        keterangan: menu?.keterangan || '',
        sort: menu?.sort || 0,
        icon: menu?.icon || '',
        is_active: menu?.is_active !== undefined ? menu.is_active : true,
        permissions: [],
        models: [],
    });

    const [policyType, setPolicyType] = useState(resolvePolicyType(menu));
    const [openDialog, setOpenDialog] = useState(false);
    const [permission, setPermission] = useState<{
        name: string;
        policy: string;
        permissions: string[];
    }>({
        name: '',
        policy: '',
        permissions: [],
    });

    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);

    const hasFetchedInitialSort = useRef(false);

    useEffect(() => {
        setData((previousData) => ({
            ...previousData,
            permissions: [...new Set(selectedPermissions)],
            models: [...new Set(selectedModels)],
        }));
    }, [selectedPermissions, selectedModels, setData]);

    const getNextSort = useCallback(async () => {
        const parentId = data.parent_id ? Number(data.parent_id) : undefined;
        const routeDefinition = parentId !== undefined ? nextSort({ menu: parentId }) : nextSort();
        const response = await axios.get(routeDefinition.url);
        setData('sort', response.data.sort);
    }, [data.parent_id, setData]);

    useEffect(() => {
        if (!hasFetchedInitialSort.current) {
            hasFetchedInitialSort.current = true;

            if (type === 'create') {
                void getNextSort();
            }

            return;
        }

        void getNextSort();
    }, [getNextSort, type]);

    useEffect(() => {
        setSelectedPermissions((prev) => [...new Set([...prev, ...permission.permissions])]);
    }, [permission.permissions]);

    useEffect(() => {
        if (!menu) return;

        const next = resolvePolicyType(menu);
        setPolicyType(next);

        setSelectedPermissions((prevState) => [...new Set([...prevState, ...(menu.permissions || [])])]);
        setSelectedModels((prevState) => [...new Set([...prevState, ...(menu.models || [])])]);
    }, [menu]);

    const handlePolicyChange = (value: string) => {
        if (!value) return;
        setPolicyType(value as typeof policyType);
    };

    const handleSubmit = (createAnother: boolean = false) => {
        const options = {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                reset();
                setPolicyType('');
                setSelectedPermissions([]);
                setSelectedModels([]);
            },
        };

        if (type === 'edit') {
            if (!menu) {
                return;
            }

            put(updateData.url({ id: menu.id }), options);
            return;
        }

        post(storeData.url({ query: { create_another: createAnother } }), options);
    };

    transform((data) => ({
        ...data,
        permissions: policyType === 'models' ? [] : data.permissions,
        models: policyType === 'permissions' ? [] : data.models,
    }));

    return (
        <form>
            <CardContent>
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="nama">Nama Menu</Label>
                        <Input
                            id="nama"
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            required
                            disabled={type === 'show'}
                        />

                        <InputError message={errors.nama} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="parent_id">Parent Menu</Label>
                        <Select value={data.parent_id} onValueChange={(value) => setData('parent_id', value)} disabled={type === 'show'}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih parent menu" />
                            </SelectTrigger>
                            <SelectContent>
                                {listMenu &&
                                    listMenu.map((menu) => (
                                        <SelectItem key={menu.id} value={String(menu.id)}>
                                            {menu.nama}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>

                        <InputError message={errors.parent_id} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="keterangan">Keterangan</Label>
                        <Textarea
                            id="keterangan"
                            value={data.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            disabled={type === 'show'}
                        />

                        <InputError message={errors.keterangan} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sort">Urutan Menu</Label>
                        <Input
                            id="sort"
                            className="max-w-[180px]"
                            type="number"
                            value={data.sort}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                const nextValue = Number.isNaN(value) ? 0 : Math.max(0, value);
                                setData('sort', nextValue);
                            }}
                            disabled={type === 'show'}
                        />

                        <InputError message={errors.sort} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="icon">Icon</Label>
                        <Input id="icon" type="text" value={data.icon} onChange={(e) => setData('icon', e.target.value)} disabled={type === 'show'} />

                        <InputError message={errors.icon} className="mt-2" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(state) => setData('is_active', state)}
                            disabled={type === 'show'}
                        />
                        <Label htmlFor="is_active">Menu Aktif/Tidak Aktif</Label>
                    </div>
                </div>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Pilih policy untuk menu</CardTitle>
                        <CardDescription>Policy untuk mengatur akses user terhadap menu menu yang ada</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="icon">Jenis Policy</Label>
                                <Select value={policyType} onValueChange={handlePolicyChange} disabled={type === 'show'}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Pilih jenis policy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="models">Models</SelectItem>
                                        <SelectItem value="permissions">Permissions</SelectItem>
                                        <SelectItem value="permissions_and_models">Permissions & Models</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {policyType === 'models' && (
                                <div className="grid gap-2">
                                    <Label>Models</Label>

                                    <MultiSelect
                                        options={listModel || []}
                                        onValueChange={setSelectedModels}
                                        defaultValue={selectedModels}
                                        placeholder="Pilih Model"
                                        variant="inverted"
                                        maxCount={7}
                                        disabled={type === 'show'}
                                    />
                                </div>
                            )}

                            {policyType === 'permissions' && (
                                <div className="grid gap-2">
                                    <Label>Permissions</Label>

                                    <div className="flex">
                                        <MultiSelect
                                            options={listPermission || []}
                                            onValueChange={setSelectedPermissions}
                                            defaultValue={selectedPermissions}
                                            placeholder="Pilih Permissions"
                                            variant="inverted"
                                            maxCount={7}
                                            disabled={type === 'show'}
                                        />

                                        <Button
                                            variant="outline"
                                            className="p-5"
                                            type="button"
                                            onClick={() => setOpenDialog(true)}
                                            disabled={type === 'show'}
                                        >
                                            <Plus /> Tambah
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {policyType === 'permissions_and_models' && (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Models</Label>

                                        <MultiSelect
                                            options={listModel || []}
                                            onValueChange={setSelectedModels}
                                            defaultValue={selectedModels}
                                            placeholder="Pilih Model"
                                            variant="inverted"
                                            maxCount={7}
                                            disabled={type === 'show'}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Permissions</Label>

                                        <div className="flex">
                                            <MultiSelect
                                                options={listPermission || []}
                                                onValueChange={setSelectedPermissions}
                                                defaultValue={selectedPermissions}
                                                placeholder="Pilih Permissions"
                                                variant="inverted"
                                                maxCount={7}
                                                disabled={type === 'show'}
                                            />

                                            <Button
                                                variant="outline"
                                                className="p-5"
                                                type="button"
                                                onClick={() => setOpenDialog(true)}
                                                disabled={type === 'show'}
                                            >
                                                <Plus /> Tambah
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
            <CardFooter>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={() => {
                            if (type !== 'show') {
                                handleSubmit(false);
                                return;
                            }

                            if (menu?.id) {
                                router.get(edit.url({ id: menu.id }));
                            }
                        }}
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
                        <Link href={index().url}>{type === 'show' ? 'Kembali' : 'Batal'}</Link>
                    </Button>
                </div>
            </CardFooter>
            <ModalPermissions
                permissionName={data.nama}
                open={openDialog}
                onOpenChange={setOpenDialog}
                setPermission={setPermission}
                permission={permission}
            />
        </form>
    );
};

const policy = [
    { value: 'view-any', label: 'View Any' },
    { value: 'view', label: 'View' },
    { value: 'create', label: 'Create' },
    { value: 'update', label: 'Update' },
    { value: 'delete', label: 'Delete' },
    { value: 'restore', label: 'Restore' },
    { value: 'force-delete', label: 'Force Delete' },
];

const formatPermission = (name: string) => {
    return name
        .replace(/\s+/g, '-') // replace space with strip
        .replace(/--+/g, '-') // replace multiple strip with single strip
        .replace(/[^a-zA-Z0-9_-]/g, '') // remove non-alphanumeric and underscore
        .toLowerCase();
};

export const ModalPermissions = ({
    permissionName,
    open,
    onOpenChange,
    setPermission,
    permission,
}: {
    permissionName: string;
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    setPermission: Dispatch<SetStateAction<{ name: string; policy: string; permissions: string[] }>>;
    permission: { name: string; policy: string; permissions: string[] };
}) => {
    const { type, menu } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const handleSubmit = () => {
        if (!menu && type === 'edit') return;

        let query = { type } as Record<string, string | number | undefined>;

        if (type === 'edit') {
            query = { type, menu: menu.id };
        }

        post(StorePermissionController.url({ query }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setPermission((prevState) => ({
                    ...prevState,
                    permissions: [...prevState.permissions, data.name],
                }));
            },
            onFinish: () => {
                reset();
                setPermission((data) => ({
                    ...data,
                    name: formatPermission(permissionName),
                    policy: '',
                }));
                onOpenChange(false);
            },
        });
    };

    useEffect(() => {
        const name = formatPermission(permission.name);
        const policy = formatPermission(permission.policy);
        const formattedPermission = policy ? `${name}:${policy}` : name;
        setData('name', formattedPermission);
    }, [permission, setData]);

    useEffect(() => {
        setPermission((data) => ({ ...data, name: formatPermission(permissionName) }));
    }, [permissionName, setPermission]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tambah Permission</DialogTitle>
                    <DialogDescription>Tambahkan permission untuk user bisa mengakses menu</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name:
                        </Label>
                        <div className="col-span-3 flex">
                            <Input id="name" value={permission.name} onChange={(e) => setPermission((data) => ({ ...data, name: e.target.value }))} />
                            <Select value={permission.policy} onValueChange={(value) => setPermission((data) => ({ ...data, policy: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Policy" />
                                </SelectTrigger>
                                <SelectContent>
                                    {policy.map((item) => (
                                        <SelectItem key={item.value} value={String(item.value)}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="flex gap-4">
                        <span>Permission: </span>
                        <Badge variant="outline">{data.name}</Badge>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit} disabled={processing}>
                        {processing && <LoaderCircle className="animate-spin" />} Save changes
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" disabled={processing}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Cru;
