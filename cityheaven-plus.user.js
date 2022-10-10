// ==UserScript==
// @name        cityheaven-plus
// @version     0.0.6
// @match       https://www.cityheaven.net/*
// ==/UserScript==

(function() {
    'use strict';

    // オフィシャルフラグを削除する
    if (location.search.match(/\bof=[^&]*\b/)) {
        location.search = location.search.replace(/\bof=[^&]*\b/, '')
        return
    }

    // 便利リンクを作る
    const myh = document.getElementsByClassName('myh')[0]
    if (myh) {
        const ul = myh.parentNode.parentNode
        const li = document.createElement('li')
        ul.insertBefore(li, null)
        li.innerHTML = `
            <a href="/tt/community/ABFavoriteGirlList/?spmode=pc">マイガ</a>
            <a href="/tt/community/ABMyAlbumShukkin/?spmode=pc">出勤</a>
            <a href="/tt/community/SBMyAlbumShukkin/?pcmode=sp" target="_blank">週間</a>
            <a href="/mypage/comeonlist/?spmode=pc" target="_blank">キテネ</a>
        `
    }

    const myg = document.getElementsByClassName('header-wrap-menu-item')[1]
    if (myg) {
        const menuDiv = myg.parentNode
        const div = document.createElement('div')
        div.className = 'header-wrap-menu-item'
        menuDiv.insertBefore(div, myg.nextSibling)
        div.innerHTML = `
            <a href="/tt/community/ABMyAlbumShukkin/?spmode=pc">出勤</a>
            ・<a href="/tt/community/SBMyAlbumShukkin/?pcmode=sp" target="_blank">週間</a>
            ・<a href="/mypage/comeonlist/?spmode=pc" target="_blank">キテネ</a>
        `
    }

    // いろいろな画面でお気に入り数を表示する
    const show_fav = (c) => {
        let common_sid = undefined

        document.querySelectorAll(c.list_selector).forEach(elm => {
            const ids = c.get_ids(elm)
            ids.sid ||= common_sid ||= function() {
                for (const s of document.getElementsByTagName('script')) {
                    const m = s.innerText.match(/'shop_id':'(\d+)'/)
                    if (m) {
                        common_sid = m[1]
                        return common_sid
                    }
                }
            }()
            fetch(`https://www.cityheaven.net/api/myheaven/v1/getgirlfavcnt/?girl_id=${ids.gid}&commu_id=${ids.sid}`)
                .then(res => res.json()).then(fav => {
                    const show_elm = elm.querySelectorAll(c.show_selector)[0]
                    show_elm.innerHTML = c.modify_html(show_elm.innerHTML, fav.cnt)
                })
        })
    }

    if (location.pathname.match(/attend/)) {
        show_fav({
            list_selector: 'div.sugunavi_wrapper a',
            get_ids: a => { return { gid: a.href.match(/girlid-(\d+)/)[1] } },
            show_selector: 'p.year_font_size',
            modify_html: (html, count) => { return `${html} [${count}]` }
        })
    }

    if (location.pathname.match(/girllist/)) {
        show_fav({
            list_selector: 'div.girllistimg a',
            get_ids: a => { return { gid: a.href.match(/girlid-(\d+)/)[1] } },
            show_selector: 'div.girllisttext',
            modify_html: (html, count) => { return html.replace('<br>', ` [${count}]<br>`) }
        })
    }

    if (location.pathname.match(/ABMyAlbumShukkin/)) {
        show_fav({
            list_selector: 'div.recommend-block',
            get_ids: div => {
                const m = div.getElementsByClassName('recommend-block-box')[0]
                    .getElementsByTagName('a')[0]
                    .href.match(/commuid=(\d+)&girlId=(\d+)/)
                return { sid: m[1], gid: m[2] }
            },
            show_selector: 'h3.recommend-block-top-name',
            modify_html: (html, count) => { return `
                ${html}<span style="font-size: 13px; font-weight: normal;">[${count}]</span>
            `}
        })
    }
})()
