import { STUDENT } from '../constants/student';

export type CategoryId = 'all' | 'food' | 'drink' | 'study';

export interface Product {
    id: number;
    title: string;
    price: number;
    displayPrice: string;
    image: string;
    category: CategoryId;
    description: string;
}

interface MenuItem {
    title: string;
    price: number;
    image: string;
    description: string;
}

const FOOD_MENU: MenuItem[] = [
    {
        title: 'Cơm tấm sườn nướng KTX',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        description: 'Cơm tấm thơm dẻo cùng sườn nướng đậm vị, ốp la và mỡ hành.',
    },
    {
        title: 'Bánh mì ốp la thịt nướng',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
        description: 'Bánh mì giòn rụm kẹp thịt nướng, trứng ốp la và dưa chua.',
    },
    {
        title: 'Mì trộn trứng lòng đào',
        price: 30000,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        description: 'Mì trộn sốt cay ngọt kèm xúc xích và trứng lòng đào béo ngậy.',
    },
    {
        title: 'Bánh bao nhân thịt trứng cút',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
        description: 'Bánh bao nóng hổi nhân thịt nướng trứng cút thơm lừng.',
    },
    {
        title: 'Cơm chiên hải sản Campus',
        price: 40000,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        description: 'Cơm chiên hạt vàng giòn cùng tôm, mực và rau củ tươi.',
    },
    {
        title: 'Gà chiên giòn rụm KTX',
        price: 38000,
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
        description: 'Đùi gà chiên xù giòn tan kèm sốt tương cà tương ớt.',
    },
];

const DRINK_MENU: MenuItem[] = [
    {
        title: 'Trà sữa trân châu đường đen',
        price: 28000,
        image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
        description: 'Trà sữa ngọt thanh béo ngậy kèm trân châu đường đen dẻo thơm.',
    },
    {
        title: 'Cà phê sữa đá Sài Gòn',
        price: 20000,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
        description: 'Cà phê phin nguyên chất đắng nhẹ, béo ngọt đậm đà tỉnh táo.',
    },
    {
        title: 'Trà đào cam sả mát lạnh',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        description: 'Trà thanh nhiệt kết hợp đào miếng giòn ngọt và hương sả thơm.',
    },
    {
        title: 'Nước ép cam tươi 100%',
        price: 22000,
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400',
        description: 'Cam tươi vắt nguyên chất bổ sung vitamin C năng lượng.',
    },
    {
        title: 'Sinh tố bơ cốt dừa',
        price: 30000,
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400',
        description: 'Bơ sáp dẻo béo sánh mịn cùng nước cốt dừa thơm phức.',
    },
    {
        title: 'Trà matcha latte đá',
        price: 27000,
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400',
        description: 'Bột matcha Nhật Bản nguyên chất thơm nhẹ béo mịn.',
    },
];

const STUDY_MENU: MenuItem[] = [
    {
        title: 'Sổ tay sinh viên A5 lò xo',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        description: 'Bìa cứng lò xo 200 trang giấy chống lem mực.',
    },
    {
        title: 'Bút gel đen ngòi 0.5mm (Hộp 5 cây)',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1585336261026-875a60a1c92f?w=400',
        description: 'Mực gel mịn đều, ngòi 0.5mm êm ái cho kỳ thi.',
    },
    {
        title: 'Máy tính khoa học FX-580VN',
        price: 450000,
        image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400',
        description: 'Máy tính bỏ túi 521 tính năng chuyên dụng sinh viên.',
    },
    {
        title: 'Bộ thước kẻ & Compa học sinh',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
        description: 'Bộ thước đa năng kèm compa chính xác.',
    },
];

export async function fetchProducts(): Promise<Product[]> {
    try {
        // Thử fetch API để giữ luồng bất đồng bộ
        await fetch('https://fakestoreapi.com/products?limit=1').catch(() => null);

        const allItems: Product[] = [];
        let idCounter = 1;

        // 1. Thêm đồ ăn
        FOOD_MENU.forEach(item => {
            allItems.push({
                id: idCounter++,
                title: item.title,
                price: item.price,
                displayPrice: item.price.toLocaleString('vi-VN') + ' đ',
                image: item.image,
                category: 'food',
                description: item.description,
            });
        });

        // 2. Thêm thức uống
        DRINK_MENU.forEach(item => {
            allItems.push({
                id: idCounter++,
                title: item.title,
                price: item.price,
                displayPrice: item.price.toLocaleString('vi-VN') + ' đ',
                image: item.image,
                category: 'drink',
                description: item.description,
            });
        });

        // 3. Thêm dụng cụ học tập
        STUDY_MENU.forEach(item => {
            allItems.push({
                id: idCounter++,
                title: item.title,
                price: item.price,
                displayPrice: item.price.toLocaleString('vi-VN') + ' đ',
                image: item.image,
                category: 'study',
                description: item.description,
            });
        });

        return allItems;
    } catch {
        return [
            {
                id: 1,
                title: 'Cơm tấm sườn nướng KTX',
                price: 35000,
                displayPrice: '35.000 đ',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
                category: 'food',
                description: 'Cơm tấm sườn nướng thơm ngon dẻo hạt.',
            },
            {
                id: 2,
                title: 'Trà sữa trân châu đường đen',
                price: 28000,
                displayPrice: '28.000 đ',
                image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
                category: 'drink',
                description: 'Trà sữa trân châu thơm ngon béo ngậy.',
            },
        ];
    }
}
