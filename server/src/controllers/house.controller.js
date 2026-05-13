const { House } = require('../models');

// 1. Crear Inmueble
exports.createHouse = async (req, res) => {
    try {
        const { address, price, status } = req.body;
        const newHouse = await House.create({
            address,
            price,
            status,
            sellerId: req.user.id // Extraído del JWT
        });
        res.status(201).json(newHouse);
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar inmueble' });
    }
};

// 2. Obtener todos los inmuebles
exports.getAllHouses = async (req, res) => {
    try {
        const houses = await House.findAll();
        res.json(houses);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener inmuebles' });
    }
};

// 3. OBTENER UN INMUEBLE POR ID (Esta es la que faltaba y causaba el error)
exports.getHouseById = async (req, res) => {
    try {
        const { id } = req.params;
        const house = await House.findByPk(id);
        if (!house) return res.status(404).json({ message: 'Inmueble no encontrado' });
        res.json(house);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el inmueble' });
    }
};

// 4. Actualizar Inmueble
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

// 5. Eliminar Inmueble
exports.deleteHouse = async (req, res) => {
    try {
        const { id } = req.params;
        const house = await House.findByPk(id);
        if (!house) return res.status(404).json({ message: 'Inmueble no encontrado' });

        await house.destroy();
        res.json({ message: 'Inmueble eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};