import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SubMenu from './sub-menu/sub-menu';

const Relations = () => {
    return (
        <div className='p-4'>
        <Tabs defaultValue='sub-menu'>
            <TabsList className='flex w-full justify-start'>
                <TabsTrigger value='sub-menu'>Sub Menu</TabsTrigger>
            </TabsList>
            <TabsContent value='sub-menu'>
                <SubMenu />
            </TabsContent>
        </Tabs>
        </div>
    )
}

export default Relations
