const { House, User } = require('../models');

// Crear nueva venta
exports.createHouse = async (req, res) => {
    try {
        const { address, price, status } = req.body;
        const sellerId = req.user.id; // Obtenido del token JWT en el middleware

        const newHouse = await House.create({ address, price, status, sellerId });
        res.status(201).json(newHouse);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la venta del inmueble' });
    }
};

// Listar ventas (con filtro opcional)
exports.getAllHouses = async (req, res) => {
    try {
        const { status } = req.query; // Para filtrar vía ?status=vendido
        const whereClause = status ? { status } : {};

        const houses = await House.findAll({
            where: whereClause,
            include: [{ model: User, as: 'seller', attributes: ['name', 'email'] }]
        });
        res.json(houses);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener inmuebles' });
    }
};

// Actualizar inmueble
exports.updateHouse = async (req, res) => {
    try {
        const { id } = req.params;
        const house = await House.findByPk(id);

        if (!house) return res.status(404).json({ message: 'Inmueble no encontrado' });

        await house.update(req.body);
        res.json({ message: 'Inmueble actualizado', house });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar' });
    }
};

// Eliminar inmueble
exports.deleteHouse = async (req, res) => {
    try {
        const { id } = req.params;
        const house = await House.findByPk(id);
        
        if (!house) return res.status(404).json({ message: 'Inmueble no encontrado' });

        await house.destroy();
        res.json({ message: 'Registro de venta eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};