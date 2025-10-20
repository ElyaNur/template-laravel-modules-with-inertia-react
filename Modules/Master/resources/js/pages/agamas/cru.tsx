import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AgamaData, SharedData } from '@/types';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ChangeEvent } from 'react';
import AgamaController from '../../../../../../resources/js/actions/Modules/Master/Http/Controllers/AgamaController';

type FormDataType = {
    nama: string;
};

const Cru = ({ agama }: { agama?: AgamaData }) => {
    const { type } = usePage<SharedData>().props;

    const { data, setData, post, put, processing, errors, reset } = useForm<FormDataType>({
        nama: agama?.nama || '',
    });

    const handleInputRoleName = (e: ChangeEvent<HTMLInputElement>) => {
        setData('nama', e.target.value.toLowerCase());
    };

    const handleSubmit = (createAnother: boolean = false) => {
        const options = {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                reset();
            },
        };

        if (type === 'edit') {
            if (!agama) {
                return;
            }

            put(AgamaController.update.url({ id: agama.id }), options);
            return;
        }

        post(AgamaController.store.url({ query: { create_another: createAnother } }), options);
    };

    return (
        <form>
            <CardContent>
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            Nama Agama <span className="text-red-400">*</span>
                        </Label>
                        <Input id="name" type="text" value={data.nama} onChange={handleInputRoleName} required disabled={type === 'show'} />

                        <InputError message={errors.nama} className="mt-2" />
                    </div>
                </div>
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

                            if (agama?.id) {
                                router.get(AgamaController.edit.url({ id: agama.id }));
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
                        <Link href={AgamaController.index()}>{type === 'show' ? 'Kembali' : 'Batal'}</Link>
                    </Button>
                </div>
            </CardFooter>
        </form>
    );
};

export default Cru;
