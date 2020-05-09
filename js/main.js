$(function () {

    //カードを作成
    let allCard = [];
    const cardPattern = ["h", "c", "d", "s"];
    const cardNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    let comCard = [];
    let humCard = [];
    let comNum = 0;
    let humNum = 0;
    let betNum = 0;
    let total = 1000;

    //カードをめくる
    function cardOpen(hand, area) {
        let cardLength = allCard.length;
        let random = Math.floor(Math.random() * cardLength);
        hand.push(allCard[random]);
        let num = allCard[random][1];
        let joinCard = allCard[random].join("");
        allCard.splice(random, 1);
        let appImg = '<img src="img/' + joinCard + '.png">'
        if (area == 1) {
            $('.comarea').append(appImg);
        } else if (area == 2) {
            $('.comarea').append('<img src="img/card_red.png">');
        } else {
            $('.humarea').append(appImg);
        }
        return num;
    }


    //得点を計算
    function cardCount(hand) {
        let num = 0;
        hand.forEach(function (value) {
            console.log(value[1]);
            if (value[1] >= 10) {
                num += 10;
            } else {
                num += value[1];
            }
        });
        // console.log(num);
        return num;
    }
    //ベットを押した時
    $('#bet').on('click', function () {
        $('#deal').fadeIn(1000);
        if (total > 0) {
            betNum += 100;
            total -= 100;
            $('#betPoint').html(betNum);
            $('#total').html(total);
        }
    });

    //dealを押した時
    $('#deal').on('click', function () {
        $('#deal').fadeOut(0);
        $('#bet').fadeOut(0);
        $('#hit').fadeIn(1000);
        $('#stand').fadeIn(1000);
        //カードをリセット
        allCard = [];
        comCard = [];
        humCard = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                let conbi = [cardPattern[i], cardNumber[j]];
                //console.log(conbi);
                allCard.push(conbi);
            }
        }
        // console.log(allCard);
        //カードを配る
        cardOpen(comCard, 1);
        cardOpen(comCard, 2);
        cardOpen(humCard);
        cardOpen(humCard);
        //初期の点数
        comNum = cardCount(comCard);
        humNum = cardCount(humCard);
        // console.log(allCard);
        // $('#com').html(comNum);
        // $('#hum').html(humNum);
    });

    //hitを押した時
    $('#hit').on('click', function () {
        let num = cardOpen(humCard);
        if (num >= 10) {
            humNum += 10;
        } else {
            humNum += num;
        }
        // $('#hum').html(humNum);
        console.log(humNum);
        if (humNum > 21) {
            setTimeout(function () {
                betNum = 0;
                $('#betPoint').html(betNum);
                if (total == 0) {
                    alert('ゲーム終了');
                    location.href = "index.html";
                } else {
                    let gameConti = confirm("burst\nあなたの負けです\n\nゲームを続けますか？");
                    removeCard(gameConti);
                }
            }, 2000);
        }
    });

    //standを押した時
    $('#stand').on('click', function () {
        $('#stand').fadeOut(0);
        $('#hit').fadeOut(0);
        const reverse = comCard[1].join("");
        const reverseCard = $('.comarea').children('img').eq(1);
        reverseCard.remove();
        $('.comarea').append('<img src="img/' + reverse + '.png">');
        //10以下の時humがAを持っているか
        if (humNum <= 11) {
            let counthumA = 0;
            humCard.forEach(function (value) {
                if (value[1] == 1) {
                    counthumA++;
                }
            });
            if (counthumA > 0) {
                humNum += 10;
            }
        }
        //comがAを持っているか
        let countA = 0;
        comCard.forEach(function (value) {
            if (value[1] == 1) {
                countA++;
            }
        });
        //１７以上までカードを引く
        let timer = setInterval(function () {
            if (comNum < 17) {
                if (countA > 0) {
                    haveA();
                } else {
                    nothaveA();
                }
            } else {
                clearInterval(timer);
                if (comNum > 21) {
                    let payout = betNum * 2;
                    betNum = 0;
                    $('#betPoint').html(betNum);
                    let timer2 = setInterval(function () {
                        if (payout > 0) {
                            payout--;
                            total++;
                            $('#total').html(total);
                        } else {
                            clearInterval(timer2);
                            setTimeout(function () {
                                let gameConti = confirm("親のburst\nあなたの勝ちです\n\nゲームを続けますか？");
                                removeCard(gameConti);
                            }, 100);
                        }
                    }, 5);
                } else if (humNum == comNum) {
                    let payout = betNum;
                    betNum = 0;
                    $('#betPoint').html(betNum);
                    let timer2 = setInterval(function () {
                        if (payout > 0) {
                            payout--;
                            total++;
                            $('#total').html(total);
                        } else {
                            clearInterval(timer2);
                            setTimeout(function () {
                                let gameConti = confirm("com:" + comNum + "\nyou:" + humNum + "\ndraw\n引き分けです\n\nゲームを続けますか？");
                                removeCard(gameConti);
                            }, 100);
                        }
                    }, 5);
                } else if (humNum > comNum) {
                    if (humNum == 21) {
                        let payout = betNum * 3;
                        betNum = 0;
                        $('#betPoint').html(betNum);
                        let timer2 = setInterval(function () {
                            if (payout > 0) {
                                payout--;
                                total++;
                                $('#total').html(total);
                            } else {
                                clearInterval(timer2);
                                setTimeout(function () {
                                    let gameConti = confirm("BlackJack!\n\ncom:" + comNum + "\nyou:" + humNum + "\nあなたの勝ちです\n\nゲームを続けますか？");
                                    removeCard(gameConti);
                                }, 100);
                            }
                        }, 5);
                    } else {
                        let payout = betNum * 2;
                        betNum = 0;
                        $('#betPoint').html(betNum);
                        let timer2 = setInterval(function () {
                            if (payout > 0) {
                                payout--;
                                total++;
                                $('#total').html(total);
                            } else {
                                clearInterval(timer2);
                                setTimeout(function () {
                                    let gameConti = confirm("com:" + comNum + "\nyou:" + humNum + "\nあなたの勝ちです\n\nゲームを続けますか？");
                                    removeCard(gameConti);
                                }, 100);
                            }
                        }, 5);
                    }
                } else {
                    betNum = 0;
                    $('#betPoint').html(betNum);
                    if (total == 0) {
                        alert('ゲーム終了');
                        location.href = "index.html";
                    } else {
                        let gameConti = confirm("com:" + comNum + "\nyou:" + humNum + "\nあなたの負けです\n\nゲームを続けますか？");
                        removeCard(gameConti);
                    }
                }
            }
        }, 2000);

        //Aがある時のcomの挙動
        function haveA() {
            if (comNum >= 7 && comNum <= 11) {
                comNum += 10;
            } else {
                let reopen = cardOpen(comCard, 1);
                switch (reopen) {
                    case 11:
                    case 12:
                    case 13:
                        comNum += 10;
                        break;
                    case 1:
                        if (comNum >= 6 && comNum <= 10) {
                            comNum += 11;
                        } else {
                            comNum++;
                        }
                        break;
                    default:
                        comNum += reopen;
                        if (comNum >= 7 && comNum <= 11) {
                            comNum += 10;
                        }
                        break;
                }
            }
            console.log(comNum);
            // $('#com').html(comNum);
        }

        //Aがない時のcomの挙動
        function nothaveA() {
            let reopen = cardOpen(comCard, 1);
            switch (reopen) {
                case 11:
                case 12:
                case 13:
                    comNum += 10;
                    break;
                case 1:
                    if (comNum >= 6 && comNum <= 10) {
                        comNum += 11;
                    } else {
                        comNum++;
                    }
                    countA++;
                    break;
                default:
                    comNum += reopen;
                    break;
            }
            console.log(comNum);
            // $('#com').html(comNum);
        }
    });
    //confirmの結果で分岐
    function removeCard(conf) {
        if (conf) {
            const removeC = $('.comarea').children('img');
            removeC.remove();
            const removeH = $('.humarea').children('img');
            removeH.remove();
            $('#bet').fadeIn(1000);
            $('#hit').fadeOut(0);
            $('#stand').fadeOut(0);
        } else {
            alert('ゲーム終了\n\ntotal:' + total);
            location.href = "index.html";
        }
    }

});