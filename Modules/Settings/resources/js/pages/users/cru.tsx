import UserController from '@/actions/Modules/Settings/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { SharedData, UserData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

const Cru = ({ user }: { user?: UserData }) => {
    const { list_role: listRole, type } = usePage<SharedData>().props;

    const roleData = useMemo(() => {
        return user?.roles?.map((role) => role.id) || [];
    }, [user]);

    const { data, setData, post, put, processing, errors, reset } = useForm<{
        name: string;
        username: string;
        email: string;
        roles: number[];
    }>({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        roles: roleData,
    });

    const [selectedRoles, setSelectedRoles] = useState<string[]>(roleData.map((role) => role.toString()));

    useEffect(() => {
        setData((previousData) => ({
            ...previousData,
            roles: selectedRoles.map((role) => parseInt(role)),
        }));
    }, [selectedRoles, setData]);

    const handleSubmit = (createAnother: boolean = false) => {
        if (!user) return;
        const method = type === 'edit' ? put : post;
        const url =
            type === 'edit' ? UserController.update.url({ id: user.id }) : UserController.store.url({ query: { create_another: createAnother } });

        method(url, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                reset();
                setSelectedRoles([]);
            },
        });
    };

    const handleInputName = (e: ChangeEvent<HTMLInputElement>) => {
        setData((data) => ({
            ...data,
            name: e.target.value,
            username: e.target.value
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '_'),
        }));
    };

    const handleInputUsername = (e: ChangeEvent<HTMLInputElement>) => {
        setData((data) => ({
            ...data,
            username: e.target.value
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '_'),
        }));
    };

    return (
        <form>
            <CardContent>
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="nama">
                            Nama <span className="text-red-400">*</span>
                        </Label>
                        <Input id="nama" type="text" value={data.name} onChange={handleInputName} required disabled={type === 'show'} />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username">
                            Username <span className="text-red-400">*</span>
                        </Label>
                        <Input id="username" type="text" value={data.username} onChange={handleInputUsername} required disabled={type === 'show'} />

                        <InputError message={errors.username} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={type === 'show'}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label>
                            List Roles <span className="text-red-400">*</span>
                        </Label>

                        <MultiSelect
                            options={listRole.map((item) => ({ ...item, value: item.value.toString() })) || []}
                            onValueChange={setSelectedRoles}
                            defaultValue={selectedRoles}
                            placeholder="Pilih Role"
                            variant="inverted"
                            maxCount={7}
                            disabled={type === 'show'}
                        />

                        <InputError message={errors.roles} className="mt-2" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={() => (type !== 'show' ? handleSubmit(false) : UserController.edit.url({ id: user?.id || 1 }))}
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
                        <Link href={UserController.index()}>{type === 'show' ? 'Kembali' : 'Batal'}</Link>
                    </Button>
                </div>
            </CardFooter>
        </form>
    );
};

export default Cru;
