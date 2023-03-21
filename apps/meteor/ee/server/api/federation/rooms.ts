import {
	isFederationAddServerProps,
	isFederationRemoveServerProps,
	isFederationSearchPublicRoomsProps,
	isFederationJoinExternalPublicRoomProps,
	isFederationVerifyMatrixIdProps,
} from '@rocket.chat/rest-typings';
import { FederationEE } from '@rocket.chat/core-services';

import { API } from '../../../../app/api/server';

API.v1.addRoute(
	'federation/searchPublicRooms',
	{
		authRequired: true,
		validateParams: isFederationSearchPublicRoomsProps,
	},
	{
		async get() {
			const { count } = this.getPaginationItems();
			const { serverName, roomName, pageToken } = this.queryParams;

			const result = await FederationEE.searchPublicRooms(serverName, roomName, pageToken, count);

			return API.v1.success(result);
		},
	},
);

API.v1.addRoute(
	'federation/listServersByUser',
	{
		authRequired: true,
	},
	{
		async get() {
			const servers = await FederationEE.getSearchedServerNamesByInternalUserId(this.userId);

			return API.v1.success({
				servers,
			});
		},
	},
);

API.v1.addRoute(
	'federation/addServerByUser',
	{
		authRequired: true,
		validateParams: isFederationAddServerProps,
	},
	{
		async post() {
			const { serverName } = this.bodyParams;

			await FederationEE.addSearchedServerNameByInternalUserId(this.userId, serverName);

			return API.v1.success();
		},
	},
);

API.v1.addRoute(
	'federation/removeServerByUser',
	{
		authRequired: true,
		validateParams: isFederationRemoveServerProps,
	},
	{
		async post() {
			const { serverName } = this.bodyParams;

			await FederationEE.removeSearchedServerNameByInternalUserId(this.userId, serverName);

			return API.v1.success();
		},
	},
);

API.v1.addRoute(
	'federation/joinExternalPublicRoom',
	{
		authRequired: true,
		validateParams: isFederationJoinExternalPublicRoomProps,
	},
	{
		async post() {
			const { externalRoomId } = this.bodyParams;

			await FederationEE.joinExternalPublicRoom(this.userId, externalRoomId);

			return API.v1.success();
		},
	},
);

API.v1.addRoute(
	'federation/verifyMatrixId',
	{
		authRequired: true,
		validateParams: isFederationVerifyMatrixIdProps,
	},
	{
		async get() {
			const { matrixId } = this.queryParams;

			const result = await FederationEE.verifyMatrixId(matrixId);

			return API.v1.success({ result });
		},
	},
);
