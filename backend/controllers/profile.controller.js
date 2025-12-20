const { User } = require('../models');

const profileController = {
    // Получить профиль текущего пользователя
    async getProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            res.json(user);
        } catch (error) {
            console.error('Ошибка получения профиля:', error);
            res.status(500).json({ error: 'Ошибка при получении профиля' });
        }
    },

    // Обновить профиль
    async updateProfile(req, res) {
        try {
            const { full_name, group_name, avatar_url } = req.body;
            const user = await User.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            // Обновляем только разрешенные поля
            if (full_name) user.full_name = full_name;
            if (group_name !== undefined) user.group_name = group_name;
            if (avatar_url !== undefined) user.avatar_url = avatar_url;

            await user.save();

            const updatedUser = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });

            res.json(updatedUser);
        } catch (error) {
            console.error('Ошибка обновления профиля:', error);
            res.status(500).json({ error: 'Ошибка при обновлении профиля' });
        }
    }
};

module.exports = profileController;


