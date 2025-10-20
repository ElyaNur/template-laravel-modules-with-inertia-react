import MenuController from '@/actions/Modules/Settings/Http/Controllers/MenuController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { MenuData, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle, Plus } from 'lucide-react';
import { Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { ModalPermissions } from '../../cru';

const Cru = ({
    menu,
    type,
    setOpenDialog: setOpenMainDialog,
}: {
    menu?: MenuData;
    type: 'create' | 'edit' | 'show';
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
}) => {
    const { list_menu: listMenu, list_model: listModel, list_permission: listPermission, menu: parentMenu } = usePage<SharedData>().props;
    const { data, setData, post, put, processing, errors, reset, transform } = useForm<{
        nama: string;
        parent_id: string;
        keterangan: string;
        sort: number;
        is_active: boolean;
        permissions: string[];
        models: string[];
    }>({
        nama: menu?.nama || '',
        parent_id: String(parentMenu.id || ''),
        keterangan: menu?.keterangan || '',
        sort: menu?.sort || 0,
        is_active: menu?.is_active !== undefined ? menu.is_active : true,
        permissions: [],
        models: [],
    });

    const [policyType, setPolicyType] = useState('');
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
        const url = parentId !== undefined ? MenuController.getNextSort.url({ menu: parentId }) : MenuController.getNextSort.url();
        const response = await axios.get(url);
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

        if (menu.permissions?.length && menu.models?.length) {
            setPolicyType('permissions_and_models');
        } else if (menu.permissions?.length) {
            setPolicyType('permissions');
        } else if (menu.models?.length) {
            setPolicyType('models');
        } else {
            setPolicyType('');
        }

        setSelectedPermissions((prevState) => [...new Set([...prevState, ...(menu.permissions || [])])]);
        setSelectedModels((prevState) => [...new Set([...prevState, ...(menu.models || [])])]);
    }, [menu]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                setPolicyType('');
                setSelectedPermissions([]);
                setSelectedModels([]);
                setOpenMainDialog(false);
            },
        };

        if (type === 'edit') {
            if (!menu) {
                return;
            }

            put(MenuController.update.url({ id: menu.id }), options);
            return;
        }

        post(MenuController.store.url(), options);
    };

    transform((data) => ({
        ...data,
        permissions: policyType === 'models' ? [] : data.permissions,
        models: policyType === 'permissions' ? [] : data.models,
    }));

    return (
        <form onSubmit={handleSubmit}>
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
                                <Select
                                    value={policyType === '' ? undefined : policyType}
                                    onValueChange={(value) => setPolicyType(value)}
                                    disabled={type === 'show'}
                                >
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
            <ModalPermissions
                permissionName={data.nama}
                open={openDialog}
                onOpenChange={setOpenDialog}
                setPermission={setPermission}
                permission={permission}
            />
            <DialogFooter>
                {type === 'show' ? (
                    <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DialogClose>
                ) : (
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="animate-spin" />} {type === 'create' ? 'Simpan' : 'Update'}
                    </Button>
                )}
            </DialogFooter>
        </form>
    );
};

export default Cru;
