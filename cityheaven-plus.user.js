// ==UserScript==
// @name        cityheaven-plus
// @version     0.0.2
// @match       https://www.cityheaven.net/*
// ==/UserScript==

(function() {
    'use strict';

    // オフィシャルフラグを削除する
    if (location.search.match(/\bof=y\b/)) {
        location.search = location.search.replace(/\bof=y\b/, '')
        return
    }

    // 「マイヘブン」を「マイガール/出勤情報」へのリンクにする
    const myh = document.getElementsByClassName('myh')[0]
    if (!myh) {
        return
    }
    myh.dataset.forwardHref = myh.dataset.forwardHref.replace('ABMypageHome', 'ABMyAlbumShukkin')
})()
