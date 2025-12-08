import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '../schemas/product.schema';

interface ProductListItemProps {
    item: Product;
    isChecked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

export function ProductListItem({
    item,
    isChecked,
    onCheckedChange,
}: ProductListItemProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={`product-${item.id}`}
                    checked={isChecked}
                    onCheckedChange={onCheckedChange}
                />
                <label
                    htmlFor={`product-${item.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                    {item.productName}
                </label>
            </div>
            <p className='text-slate-600 text-sm pl-6'>
                {item.productDescription}
            </p>
        </div>
    );
}
