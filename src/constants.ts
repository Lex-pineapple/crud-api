export enum Success {
  OK = 200,
  Created = 201,
  Accepted = 202,
  NAInfo = 203,
  NoContent = 204,
  ResetContent = 205,
  PartContent = 206,
  MultiStat = 207,
  AlreadyReported = 208,
  IMUsed = 226,
}

export enum ClientError {
  BadRequest = 400,
  Unauth = 401,
  PaymentReq = 402,
  Forbidden = 403,
  NotFound = 404,
  MethNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthReq = 407,
  RFeqTimeout = 408,
}

export enum ServerError {
  InternalServErr = 500,
  NotImpl = 501,
  BadGetaway = 502,
}

export const RespCodes = {
  Success,
  ClientError,
  ServerError,
};

export const CommonErrors = {
  idInvalid: {
    message: 'User ID is invalid',
    status: RespCodes.ClientError.BadRequest,
  },
  noRecsReq: {
    message: 'Request body does not contain reqied fields',
    status: RespCodes.ClientError.BadRequest,
  },
};
