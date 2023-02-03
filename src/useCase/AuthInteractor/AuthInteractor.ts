import { verify } from 'argon2';
import mongoose from 'mongoose';
import { APIGatewayEvent } from 'aws-lambda';
import { sign, SignOptions } from 'jsonwebtoken';

import { AuthInteractorInterface, SignInRequest } from './AuthInteractorTypes';
import { IUser } from '../../controller/UserController/UserControllerTypes';
import { UserController } from '../../controller/UserController/userController';
import { eventParser } from '../../helpers/jsonHelper';

export class AuthInteractor implements AuthInteractorInterface {
	private userController;
	private body: SignInRequest;

	constructor(event: APIGatewayEvent, db: typeof mongoose) {
		this.userController = new UserController(eventParser(event), db);
		this.body = eventParser(event);
	}

	/**
	 * signIn
	 */
	public async signIn() {
		let jwtToken;
		let res;
		try {
			res = await this.userController.fetchUserByUsername();

			if (res && res.user) {
				const validPassword = await verify(
					res.user.password,
					this.body.password
				);

				if (!validPassword) {
					return {
						status: 401,
						message: 'Contraseña o Usuario Inválidos',
					};
				}

				jwtToken = this.generateToken(res.user);

				return {
					token: jwtToken,
					userId: res.user.userId,
					status: 200,
					message: 'Login exitoso',
				};
			}
		} catch (error) {
			return { status: 500, message: 'Error en login' };
		}

		return { status: 500, message: 'Error en login' };
	}

	private generateToken(user: IUser) {
		const signInOptions: SignOptions = {
			expiresIn: '8h',
		};

		return sign(
			{ userId: user.userId },
			process.env.PRIVATE_KEY as string,
			signInOptions
		);
	}

	/**
	 * verify
	 */
	public verify() {
		try {
			return {
				status: 200,
				message: 'Usuario Verificado',
				isVerified: true,
			};
		} catch (error) {
			return {
				status: 500,
				message: 'Error en login',
				isVerified: false,
			};
		}
	}
}
