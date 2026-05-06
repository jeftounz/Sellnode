const { House } = require('../models');

exports.createHouse = async (req, res) => {
    try {
        const { address, price, status } = req.body;
        const newHouse = await House.create({
            address,
            price,
            status,
            sellerId: req.user.id // ID extraído del token JWT por el middleware
        });
        res.status(201).json(newHouse);
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar inmueble' });
    }
};

exports.getAllHouses = async (req, res) => {
    try {
        const houses = await House.findAll();
        res.json(houses);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener inmuebles' });
    }
};

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