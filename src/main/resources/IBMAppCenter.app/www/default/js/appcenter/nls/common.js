
/* JavaScript content from js/appcenter/nls/common.js in folder common */
// NLS_CHARSET=UTF-8
// PII user facing
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define({
  root :
  // begin v1.x content
  ({
    // START NON-TRANSLATABLE
    // END NON-TRANSLATABLE
    catalogTitle: "Catalog",
    favoritesTitle: "Favorites",
    updatesTitle: "Updates",
    catalogTab: "Catalog",
    favoritesTab: "Favorites",
    updatesTab: "Updates",
    appcenterTitle: "App Center",
    versionHistoryTitle: "Versions",
    detailsTitle: "Details",
    reviewsTitle: "Reviews",
    rateTitle: "Write a Review",
    rateTitleShort: "Review",
    logout:"Log out",
    loadingLabel: "loading…",
    pushNotificationRegistrationError: "The push notification registration has failed. Check the registration identifier and try again later",
    globalErrorMessage: "An unexpected error occurred (${message}). Exiting",
    defaultDeviceNickname: "${username}'s ${phoneModel}",

    // START NON-TRANSLATABLE
    detailsRating: "(${nb_rating})",
    errorWithMessage:"${message}<br/>${reason}",
    // END NON-TRANSLATABLE

    loginLabel: "User name",
    passwordLabel: "Password",
    serverNameLabel: "Server",
    serverPortLabel: "Port",
    serverContextLabel: "Context",
    sslLabel: "SSL",

    tabletUsernamePH: "",
    tabletPasswordPH: "",
    tabletServerNamePH: "server[:port][/context]",

    phoneUsernamePH: "User name",
    phonePasswordPH: "Password",
    phoneServerNamePH: "Host name or IP",
    phoneServerPortPH: "Server port",
    phoneServerContextPH: "Application context",

    credentials: "Credentials",
    loginButton: "Log in",
    logoutButton: "Log out",
    refreshButton: "Refresh",
    detailsVersion: "Version: ${version}",
    detailsInternalVersion: "Internal version: ${version}",
    detailsLatestVersion: "Latest version: ${version}",
    detailsUpdatedOn: "Updated on: ${date}",
    detailsAllVersions: "All versions",
    fileSize: "Size: ${size}${unit}",
    fileSizeMbUnit: "M",
    fileSizeKbUnit: "k",
    sendButton: "Submit review",
    back: "Back",
    install: "Install",
    reInstall: "Install Again",
    revert: "Revert",
    uninstall: "Uninstall",
    cancelInstall: "Cancel installation",
    cancelUninstall: "Cancel uninstallation",
    installing: "Installing…",
    installationStarted: "Installation started…",
    update: "Update",
    gotoAppStore: "Go to Store",
    noApplication: "No application available",
    noUpdate: "No update available",
    noFavorite: "No favorite application",
    noReview: "No review on this version",
    noReviewAllVersions: "No review for this application",
    applicationFavorite: "Application is marked as favorite",
    applicationNotFavorite: "Application unmarked as favorite",
    reviewSentConfirmation: "Review sent",
    errorDialogTitle: "Error",
    warningDialogTitle: "Warning",
    okButton: "OK",
    yesButton: "Yes",
    noButton: "No",
    closeButton: "Close",
    retryButton: "Try again",
    cancelButton: "Cancel",
    versionDlgTitle: "Choose version",
    addReviewButton: "Write a review",
    rateInstalled: "Review version ${version}",
    rateInstalledDisabled: "Review installed version…",
    reviewsVersion: "Version ${version}",
    viewReviews: "View reviews",
    versionHistory: "Select version",
    noDescription: "No description…",
    popularTab: "Popular",
    lastUpdateTab: "Last Update",
    nameTab: "Name",
    loadMore: "Load more…",
    versionListInstalled: "${version} (installed)",
    updateListItemVersion: "${version} (${versionInstalled} installed)",
    ratingErrorTitle: "Rating Error",
    loginErrorTitle: "Connection Error",
    mustInstallAppToRate: "You cannot rate the application because the application version is not installed, please install the version first.",
    reviewNotSentApplicationNotInCatalog: "The review cannot be sent because the application is not in the catalog.",
    missingCommentOrRating: "Your review cannot be sent, you need to specify a rating and a comment.",
    missingInfo: "The connection to the server is not possible, the following information is missing:",
    missingLogin: "Login",
    missingPassword: "Password",
    missingServerUrl: "Application Center server URL",
    missingServer: "Application Center host name or IP address",
    invalidServerUrl: "The Application Center URL is not valid",
    invalidLoginPw: "Invalid user name or password",
    unreachableServer: "The server is unreachable. Try again later or check your connection details.",
    genericError: "Connection failed. Check your connection details.",
    genericErrorWithStatus: "Connection failed. Check your connection details (HTTP status ${status}).",
    genericErrorWithMessage: "Connection failed. Check your connection details (${message}).",
    installErrorWP81Debug: "Installation failed because you are currently using an unsigned Application Center client. You must first code sign the client XAP file to have the client running successfully (HRESULT ${hresult}).",
    installErrorWPCertificate: "Installation failed because the PFX certificate used to code sign the XAP file is expired (HRESULT ${hresult}).",
    installErrorWP: "Installation failed (HRESULT ${hresult}).",
    timeoutError: "Connection timed out. Please try again later.",
    serverError: "Server error. Contact the server administrator.",
    errorDeletedApp: "Impossible to show the application details, because the application was removed from the catalog.",
    goToCatalog: "Open Catalog View",
    appNotFound: "The application could not be found in the catalog for the current environment.",
    invalidUrl: "Invalid URL.",

    preferencesTitle: "Preferences",
    sortTitle: "Sort",

    showAllVersion: "All versions",
    applicationName: "Application Name",
    updateDialogTitle: "Updates available",
    updateDialogMessage: "Show updates?",
    appcenterUpdateDialogTitle: "An application center update is available",
    appcenterUpdateDialogMessage: "Install new version?",
    appcenterUpdateFailedMessage: "Installation of the latest version of application center failed",

    /*switch button label: 4 characters max */
    sslSwitchOn: "ON",

    /*switch button label: 4 characters max */
    sslSwitchOff: "OFF",

    // Tablet
    tabletAppcenterTitle: "Application Center",
    detailSegment: "Details",
    reviewsSegment: "Reviews ${version}",
    allReviewsSegment: "All Reviews",
    tabletNameTab: "Sort by name",
    tabletPopularTab: "Sort by popularity",
    tabletRatingTab: "Sort by rating",
    tabletLastUpdateTab: "Sort by date",

    /*sort criterion, must be less or equals 20 characters */
    sortName: "Name",
    /*sort criterion, must be less or equals 20 characters */
    sortPopularTab: "Popularity",
    /*sort criterion, must be less or equals 20 characters */
    sortRatingTab: "Rating",
    /*sort criterion, must be less or equals 20 characters */
    sortDateTab: "Date",

    toggleFavorite: "Toggle favorite"

  })
// end v1.x content
,"de":true,"es":true,"fr":true,"it":true,"ja":true,"ko":true,"pt":true,"ru":true,"zh":true,"zh-tw":true

});