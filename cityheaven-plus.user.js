// ==UserScript==
// @name        cityheaven-plus
// @version     0.0.3
// @match       https://www.cityheaven.net/*
// ==/UserScript==

(function() {
    'use strict';

    // オフィシャルフラグを削除する
    if (location.search.match(/\bof=y\b/)) {
        location.search = location.search.replace(/\bof=y\b/, '')
        return
    }

    // 便利リンクを作る
    const myh = document.getElementsByClassName('myh')[0]
    if (!myh) {
        return
    }
    const ul = myh.parentNode.parentNode
    const li = document.createElement('li')
    ul.insertBefore(li, null)
    li.innerHTML = `
        <a href="/mypage/comeonlist/?spmode=pc">キテネ</a>
        <a href="/tt/community/ABFavoriteGirlList/?spmode=pc">マイガ</a>
        <a href="/tt/community/ABMyAlbumShukkin/?spmode=pc">出勤</a>
        <a href="/tt/community/SBMyAlbumShukkin/?pcmode=sp">週間</a>
    `
})()
