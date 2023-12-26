const db = require('../models');
const { Op } = require('sequelize');
const ErrorsWithStatus = require('../constants/Error');
const HTTP_STATUS = require('../constants/httpStatus');

class RevenueServices {
    async getRevenuesByTime(startTime, endTime) {
        const OrdersInfor = await this.getListOrderByTime(startTime, endTime);

        const orders = OrdersInfor.result.orders;

        // Group orders by day
        const ordersByDay = {};
        orders.forEach((order) => {
            const day = order.createdAt.split('T')[0];
            if (!ordersByDay[day]) {
                ordersByDay[day] = [];
            }
            ordersByDay[day].push(order);
        });

        // Calculate profit and total price for each day
        const resultByDay = [];
        for (const day in ordersByDay) {
            const ordersForDay = ordersByDay[day];

            let totalRevenueForDay = 0;
            let profitForDay = 0;

            ordersForDay.forEach((order) => {
                totalRevenueForDay += order.totalPrice;
                profitForDay += order.profit;
            });

            resultByDay.push({
                date: day,
                totalRevenue: totalRevenueForDay,
                profit: profitForDay,
                orders: ordersForDay,
            });
        }

        // Calculate total revenue and profit for the entire time range
        const totalRevenue = resultByDay.reduce((acc, result) => acc + result.totalRevenue, 0);
        const profitRevenue = resultByDay.reduce((acc, result) => acc + result.profit, 0);

        return {
            success: true,
            result: {
                totalRevenue: totalRevenue,
                profitRevenue: profitRevenue,
                resultByDay: resultByDay,
            },
        };
    }

    async getListOrderByTime(startTime, endTime) {
        const Orders = await db.Order.findAll({
            where: {
                id_status: 4,
                createdAt: {
                    [Op.between]: [startTime, endTime],
                },
            },
        });
        const orders = JSON.parse(JSON.stringify(Orders));
        for (let i = 0; i < orders.length; i++) {
            var originalPrice = 0;
            const Sub_order = await db.Order.findOne({
                where: { id: orders[i].id },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                include: [
                    {
                        model: db.Size_Item,
                        through: {
                            attributes: ['quantity', 'fixed_price'],
                            as: 'order_item_infor',
                        },
                        as: 'Order_items',
                        attributes: ['id', 'size', 'amount'],
                        include: [
                            {
                                model: db.Shoes,
                                as: 'Shoes',
                                attributes: ['id', 'name', 'import_price'],
                            },
                        ],
                    },
                    { model: db.Status, as: 'Status', attributes: ['status'] },
                    {
                        model: db.Account,
                        attributes: {
                            exclude: ['password', 'forgot_password_token', 'id_role'],
                        },
                        include: [
                            {
                                model: db.inforUser,
                                as: 'inforUser',
                                attributes: ['firstname', 'lastname', 'phoneNumber', 'avatar'],
                            },
                        ],
                    },
                ],
            });
            const sub_order = JSON.parse(JSON.stringify(Sub_order));
            const order_items = sub_order.Order_items;
            for (let j = 0; j < order_items.length; j++) {
                originalPrice += order_items[j].Shoes.import_price * order_items[j].order_item_infor.quantity;
            }
            orders[i].profit = orders[i].totalPrice - originalPrice;
        }
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const profitRevenue = orders.reduce((acc, order) => acc + order.profit, 0);
        return {
            success: true,
            result: {
                totalRevenue: totalRevenue,
                profitRevenue: profitRevenue,
                orders: orders,
            },
        };
    }

    async getRevenueOfCustommer(startTime, endTime) {
        const orders = await db.Order.findAll({
            where: {
                id_status: 4,
                createdAt: {
                    [Op.between]: [startTime, endTime],
                },
            },
            include: [
                {
                    model: db.Account,
                    attributes: ['id', 'email'],
                    include: [
                        {
                            model: db.inforUser,
                            attributes: ['id', 'firstName', 'lastName', 'avatar'],
                        },
                    ],
                },
            ],
        });

        const customers = orders.reduce((customer, order) => {
            const Order = JSON.parse(JSON.stringify(order));
            const customerId = Order.Account.id;
            const customerEmail = Order.Account.email;
            const customerName = Order.Account.inforUser.firstName + ' ' + Order.Account.inforUser.lastName;
            const totalPrice = Order.totalPrice;

            if (customer[customerId]) {
                customer[customerId].totalPrice += totalPrice;
            } else {
                customer[customerId] = {
                    id: customerId,
                    email: customerEmail,
                    fullName: customerName,
                    totalPrice: totalPrice,
                };
            }

            return customer;
        }, {});
        const sortedCustomers = Object.values(customers) // Object.values() covert Object to Array
            .sort((a, b) => b.totalPrice - a.totalPrice)
            .slice(0, 20); // get only 20 customers

        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        return {
            success: true,
            result: {
                customers: sortedCustomers,
                totalRevenue: totalRevenue,
                // orders: orders,
            },
        };
    }

    async getRevenueOfProduction(startTime, endTime) {
        const orders = await db.Order.findAll({
            where: {
                id_status: 4,
                createdAt: {
                    [Op.between]: [startTime, endTime],
                },
            },
            include: [
                {
                    model: db.Size_Item,
                    through: {
                        attributes: ['quantity', 'fixed_price'],
                        as: 'order_item_infor',
                    },
                    as: 'Order_items',
                    attributes: ['id', 'size'],
                    include: [{ model: db.Shoes, as: 'Shoes', attributes: ['id', 'name', 'price'] }],
                },
            ],
        });

        const products = orders.reduce((product, order) => {
            const Order = JSON.parse(JSON.stringify(order));
            const Order_items = Order.Order_items;

            Order_items.forEach((item) => {
                const productId = item.Shoes.id;
                const productName = item.Shoes.name;
                const quantity = item.order_item_infor.quantity;
                const price = item.order_item_infor.fixed_price;

                if (product[productId]) {
                    product[productId].quantity += quantity;
                    product[productId].totalPrice += price;
                } else {
                    product[productId] = {
                        id: productId,
                        name: productName,
                        quantity: quantity,
                        totalPrice: price,
                    };
                }
            });

            return product;
        }, {});

        const sortedProducts = Object.values(products)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 20);
        for (let i = 0; i < sortedProducts.length; i++) {
            // add image
            const image = await db.Image.findOne({
                where: { id_shoes: sortedProducts[i].id },
            });
            const Image = JSON.parse(JSON.stringify(image));
            sortedProducts[i].Image = Image ? Image.image : '';
            // add category
            const shoes = await db.Shoes.findOne({
                where: { id: sortedProducts[i].id },
                include: [
                    {
                        model: db.Category,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: db.Brand,
                        attributes: ['id', 'name'],
                    },
                ],
            });
            sortedProducts[i].Category = shoes.Category;
            //add brand
            sortedProducts[i].Brand = shoes.Brand;
        }
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        return {
            success: true,
            result: {
                products: sortedProducts,
                totalRevenue: totalRevenue,
            },
        };
    }

    async getRevenueOfYear(revenueData) {
        // TODO: Implement code to create a new revenue
    }
}

module.exports = new RevenueServices();
