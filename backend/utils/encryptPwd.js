import bcrypt from 'bcrypt'

const encrypt = async (passwword) => {
    const salt = await bcrypt.genSalt(10);
    const encryptedPwd = await bcrypt.hash(passwword, salt)
    return encryptedPwd;
}

export default encrypt;