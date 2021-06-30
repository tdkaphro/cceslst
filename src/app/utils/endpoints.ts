const BASE_URL = 'http://localhost:8080/access-aligner-web-service/';

export const CONTACT = BASE_URL + 'unsecured/wsContact/sendAnonyMsg';
export const LOGIN = BASE_URL + 'oauth/token';
export const REGISTER = BASE_URL + 'unsecured/wsSubscription/subscriptionUser';
export const FORGOT_PASSWORD = BASE_URL + 'unsecured/wsSubscription/forgotPassword';
export const INFO_USER = BASE_URL + 'secured/wsUser/getInfoUser?login=';
export const RESET_PASSWORD = BASE_URL + 'unsecured/wsSubscription/changePasswordOublie';
export const TYPE_DENT = BASE_URL + 'secured/wsTraitement/getTypeDent';
export const TYPE_DOCUMENT = BASE_URL + 'secured/wsTraitement/getTypeDocument';
export const ADD_TRAITEMENT = BASE_URL + 'secured/wsTraitement/addTraitement';
export const SEND_EMAIL = BASE_URL + 'secured/wsTraitement/NotificationEmail';
export const UPDATE_USER_INFO = BASE_URL + 'secured/wsUser/updateInfoUser';
export const UPDATE_USER_PASSWORD = BASE_URL + 'secured/wsUser/updatePassword';
export const TRAITEMENT_BY_PRATICIEN = BASE_URL + 'secured/wsTraitement/getTraitementByDentiste';
export const TRAITEMENT_HISTORY = BASE_URL + 'secured/wsTraitement/getHistoriqueTraitement?idTraitement=';
export const ANONYMS_MESSAGE = BASE_URL + 'secured/wsMsgAnonyme/showReceivedMsg?login=';
export const CHANGE_STATUS_ANONYM_MESSAGE = BASE_URL + 'secured/wsMsgAnonyme/changeStatusMsg';
export const INACTIVE_PRATICIEN = BASE_URL + 'secured/wsDentiste/getDentisteForValidation';
export const ACTIVE_PRATICIEN = BASE_URL + 'secured/wsDentiste/getListeDentiste';
export const ACTIVATE_PRATICIEN = BASE_URL + 'secured/wsDentiste/changerEtatDentiste';
export const TRAITEMENTS_BY_ADMIN = BASE_URL + 'secured/wsTraitement/getTraitementForAdmin';
export const FILTERED_TRAITEMENTS_BY_ADMIN = BASE_URL + 'secured/wsTraitement/getTraitementForAdmin?idEtape=';
export const ALL_TRAITEMENT_STEPS = BASE_URL + 'secured/wsTraitement/getAllEtape';
export const TRAITEMENT_BY_ID = BASE_URL + 'secured/wsTraitement/getTraitementById';
export const TRAITEMENT_PHOTOS = BASE_URL + 'secured/wsTraitement/getDocumentsByIdTraitementAndCategDoc';
export const TRAITEMENT_MESSAGES = BASE_URL + 'secured/wsTraitement/getCommentaireTraitement';
export const TRAITEMENT_ADD_MESSAGES = BASE_URL + 'secured/wsTraitement/addCommentaireTraitement';
export const POSSIBLE_ACTIONS = BASE_URL + 'secured/wsTraitement/getPossibleAction';
export const PERFORM_ACTION = BASE_URL + 'secured/wsTraitement/performActionTraitement';
export const DOWNLOAD_DOCUMENT = BASE_URL + 'secured/wsTraitement/getDocumentsByIdTraitementAndIdDocument';
export const CHANGE_TRAITEMENT_STATUS = BASE_URL + 'secured/wsTraitement/changeStatusTraitement';
export const GET_POSSIBLE_TRANSITION = BASE_URL + 'secured/wsTraitement/getPossibleTransition';
export const ALL_ADMINS = BASE_URL + 'secured/wsAdmin/getListeAdmin';
export const ARCHIVE_ADMIN = BASE_URL + 'secured/wsAdmin/changerEtatAdmin';
export const ADD_ADMIN = BASE_URL + 'secured/wsAdmin/addUserAdmin';
export const DOWNLOAD_DOCUMENT_BY_ID = BASE_URL + 'secured/wsTraitement/getDocumentByIdTraitementDoc';
export const NOTIFICATION_COMMENTS = BASE_URL + 'secured/wsTraitement/getNotificationCommentaire';
export const NOTIFICATIONS = BASE_URL + 'secured/wsTraitement/getNotificationTraitementByLogin';
export const CHANGE_NOTIF_STATUS = BASE_URL + 'secured/wsTraitement/changeStatutNotifcation';
export const DELETE_TRT_FILE = BASE_URL + 'secured/wsTraitement/deleteDocumentByIdTraitementDoc';
export const RESET_USER_PASSWORD = BASE_URL + 'secured/wsDentiste/resetPassword';