require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Op, Sequelize, fn, col } = require('sequelize'); 
const User = require('./models/user'); 

const rehashPlaintextPasswords = async () => {
    try {
  
        const usersWithPlaintextPasswords = await User.findAll({
            where: {
                password: {
                    [Op.ne]: null, 
                },
                [Op.and]: Sequelize.where(fn('length', col('password')), Op.lt, 60) 
            }
        });

        for (let user of usersWithPlaintextPasswords) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            await user.save();
            console.log(`Updated password for user: ${user.email}`);
        }
        console.log('All plaintext passwords have been rehashed.');
    } catch (error) {
        console.error('Error rehashing passwords:', error);
    }
};

rehashPlaintextPasswords();
