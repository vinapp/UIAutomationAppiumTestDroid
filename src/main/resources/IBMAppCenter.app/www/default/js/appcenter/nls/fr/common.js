
/* JavaScript content from js/appcenter/nls/fr/common.js in folder common */
// NLS_CHARSET=UTF-8
// 
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define({
  // begin v1.x content
    // START NON-TRANSLATABLE
    // END NON-TRANSLATABLE
    catalogTitle: "Catalogue",
    favoritesTitle: "Favoris",
    updatesTitle: "Mises à jour",
    catalogTab: "Catalogue",
    favoritesTab: "Favoris",
    updatesTab: "Mises à jour",
    appcenterTitle: "App Center",
    versionHistoryTitle: "Versions",
    detailsTitle: "Détails",
    reviewsTitle: "Revues",
    rateTitle: "Rédaction d'une revue",
    rateTitleShort: "Revue",
    logout:"Déconnexion",
    loadingLabel: "chargement…",
    pushNotificationRegistrationError: "L'enregistrement de la notification push a échoué. Vérifiez l'identificateur de l'enregistrement et essayez à nouveau ultérieurement",
    globalErrorMessage: "Une erreur inattendue est survenue (${message}). Le programme est fermé.",
    defaultDeviceNickname: "${phoneModel} de ${username}",

    // START NON-TRANSLATABLE
    detailsRating: "(${nb_rating})",
    errorWithMessage:"${message}<br/>${reason}",
    // END NON-TRANSLATABLE

    loginLabel: "Nom d'utilisateur",
    passwordLabel: "Mot de passe",
    serverNameLabel: "Serveur",
    serverPortLabel: "Port",
    serverContextLabel: "Contexte",
    sslLabel: "SSL",

    tabletUsernamePH: "",
    tabletPasswordPH: "",
    tabletServerNamePH: "server[:port][/context]",

    phoneUsernamePH: "Nom d'utilisateur",
    phonePasswordPH: "Mot de passe",
    phoneServerNamePH: "Nom d'hôte ou adresse IP",
    phoneServerPortPH: "Port du serveur",
    phoneServerContextPH: "Contexte d'application",

    credentials: "Données d'identification",
    loginButton: "Connexion",
    logoutButton: "Déconnexion",
    refreshButton: "Actualiser",
    detailsVersion: "Version : ${version}",
    detailsInternalVersion: "Version interne : ${version}",
    detailsLatestVersion: "Dernière version : ${version}",
    detailsUpdatedOn: "Mise à jour le : ${date}",
    detailsAllVersions: "Toutes les versions",
    fileSize: "Taille : ${size} ${unit}",
    fileSizeMbUnit: "M",
    fileSizeKbUnit: "k",
    sendButton: "Soumettre la revue",
    back: "Retour",
    install: "Installer",
    reInstall: "Réinstaller",
    revert: "Rétablir",
    uninstall: "Désinstaller",
    cancelInstall: "Annuler l'installation",
    cancelUninstall: "Annuler la désinstallation",
    installing: "Installation en cours…",
    installationStarted: "L'installation a démarré…",
    update: "Mettre à jour",
    gotoAppStore: "Accéder au magasin",
    noApplication: "Aucune application disponible",
    noUpdate: "Aucune mise à jour disponible",
    noFavorite: "Aucune application favorite",
    noReview: "Aucune revue sur cette version",
    noReviewAllVersions: "Aucune revue pour cette application",
    applicationFavorite: "L'application est désignée comme favorite",
    applicationNotFavorite: "La désignation de l'application comme favorite a été annulée",
    reviewSentConfirmation: "Revue envoyée",
    errorDialogTitle: "Erreur",
    warningDialogTitle: "Avertissement",
    okButton: "OK",
    yesButton: "Oui",
    noButton: "Non",
    closeButton: "Fermer",
    retryButton: "Réessayer",
    cancelButton: "Annuler",
    versionDlgTitle: "Choix de la version",
    addReviewButton: "Rédiger une revue",
    rateInstalled: "Revue de la version ${version}",
    rateInstalledDisabled: "Revue de la version installée…",
    reviewsVersion: "Version ${version}",
    viewReviews: "Afficher les revues",
    versionHistory: "Sélectionner une version",
    noDescription: "Aucune description…",
    popularTab: "Populaire",
    lastUpdateTab: "Dernière mise à jour",
    nameTab: "Nom",
    loadMore: "Charger plus…",
    versionListInstalled: "${version} (installée)",
    updateListItemVersion: "${version} (${versionInstalled} installée)",
    ratingErrorTitle: "Erreur d'évaluation",
    loginErrorTitle: "Erreur de connexion",
    mustInstallAppToRate: "Vous ne pouvez pas évaluer l'application car la version de l'application n'est pas installée. Installez d'abord la version.",
    reviewNotSentApplicationNotInCatalog: "La revue ne peut pas être envoyée car l'application ne se trouve pas dans le catalogue.",
    missingCommentOrRating: "Votre revue ne peut pas être envoyée ; vous devez spécifier une évaluation et un commentaire.",
    missingInfo: "La connexion au serveur ne peut pas être établie ; les informations suivantes manquent :",
    missingLogin: "ID de connexion",
    missingPassword: "Mot de passe",
    missingServerUrl: "Adresse URL du serveur Application Center",
    missingServer: "Nom d'hôte ou adresse IP d'Application Center",
    invalidServerUrl: "L'adresse URL d'Application Center n'est pas valide",
    invalidLoginPw: "Nom d'utilisateur ou mot de passe non valide",
    unreachableServer: "Le serveur n'est pas accessible. Essayez à nouveau ultérieurement ou vérifiez vos détails de connexion.",
    genericError: "La connexion a échoué. Vérifiez vos détails de connexion.",
    genericErrorWithStatus: "La connexion a échoué. Vérifiez vos détails de connexion (statut HTTP ${status}).",
    genericErrorWithMessage: "La connexion a échoué. Vérifiez vos détails de connexion (${message}).",
    installErrorWP81Debug: "L'installation a échoué car vous utilisez actuellement un client Application Center non signé. Vous devez d'abord signer numériquement (signature de code) le fichier XAP du client pour que celui-ci fonctionne correctement (HRESULT ${hresult}).",
    installErrorWPCertificate: "L'installation a échoué car le certificat PFX utilisé pour la signature de code du fichier XAP a expiré (HRESULT ${hresult}).",
    installErrorWP: "L'installation a échoué (HRESULT ${hresult}).",
    timeoutError: "La connexion a expiré. Essayez à nouveau ultérieurement.",
    serverError: "Erreur de serveur. Prenez contact avec l'administrateur du serveur.",
    errorDeletedApp: "Impossible d'afficher les détails de l'application car celle-ci a été retirée du catalogue.",
    goToCatalog: "Ouvrir la vue catalogue",
    appNotFound: "Il se pourrait que l'application soit introuvable dans le catalogue pour l'environnement en cours.",
    invalidUrl: "URL non valide",

    preferencesTitle: "Préférences",
    sortTitle: "Tri",

    showAllVersion: "Toutes les versions",
    applicationName: "Nom de l'application",
    updateDialogTitle: "Mises à jour disponibles",
    updateDialogMessage: "Afficher les mises à jour ?",
    appcenterUpdateDialogTitle: "Une mise à jour d'Application Center est disponible",
    appcenterUpdateDialogMessage: "Souhaitez-vous installer la nouvelle version ?",
    appcenterUpdateFailedMessage: "L'installation de la dernière version d'Application Center a échoué",

    /*switch button label: 4 characters max */
    sslSwitchOn: "Oui",

    /*switch button label: 4 characters max */
    sslSwitchOff: "Non",

    // Tablet
    tabletAppcenterTitle: "Application Center",
    detailSegment: "Détails",
    reviewsSegment: "Revues de la version ${version}",
    allReviewsSegment: "Toutes les revues",
    tabletNameTab: "Trier par nom",
    tabletPopularTab: "Trier par popularité",
    tabletRatingTab: "Trier par évaluation",
    tabletLastUpdateTab: "Trier par date",

    /*sort criterion, must be less or equals 20 characters */
    sortName: "Nom",
    /*sort criterion, must be less or equals 20 characters */
    sortPopularTab: "Popularité",
    /*sort criterion, must be less or equals 20 characters */
    sortRatingTab: "Evaluation",
    /*sort criterion, must be less or equals 20 characters */
    sortDateTab: "Date",

    toggleFavorite: "Activer/désactiver le favori"

// end v1.x content
});

