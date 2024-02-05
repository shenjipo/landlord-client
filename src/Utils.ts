import { Card, PlayType, VALUE } from "./constant";

export class Utils {

    static copy(data: any) {
        return JSON.parse(JSON.stringify(data))
    }
    static isValidPlayType(val: Nullable<PlayType | 'others'>) {
        if (!val || val === 'others') return false
        return [PlayType.bomb, PlayType.fourSameWithTwo, PlayType.king, PlayType.oneStraight, PlayType.pairs,
        PlayType.single, PlayType.three, PlayType.threeStaright, PlayType.threeStarightWithFour, PlayType.threeStarightWithTwo,
        PlayType.threeWithOne, PlayType.threeWithTwo, PlayType.twoStraight].includes(val)
    }
    static sortedCardValue(carValueList: Array<string>) {
        const valueToNumber: any = {
            'two': 2,
            'three': 3,
            'four': 4,
            'five': 5,
            'six': 6,
            'seven': 7,
            'eight': 8,
            'nine': 9,
            'ten': 10,
            'J': 11,
            'Q': 12,
            'K': 13,
            'one': 14,
            "SmallGhost": 140,
            'BigGhost': 150
        }
        // 从大到小到排序
        return carValueList.sort((a, b) => {
            return valueToNumber[b] - valueToNumber[a]
        })
    }
    // 比大小 B是否比A大
    static judgeIsBigger(cardListA: Array<Card>, cardListB: Array<Card>,) {
        let typeA: PlayType | 'others' = Utils.judgeType(cardListA)
        let typeB: PlayType | 'others' = Utils.judgeType(cardListB)

        if (typeA === 'others' || typeB === 'others') return 'error'

        // 类型碾压
        if (typeB === PlayType.bomb && ![PlayType.bomb, PlayType.king].includes(typeA)) {
            // B是炸弹 A不是炸弹 不是王炸
            return true
        } if (typeB === PlayType.king) {
            // B是炸弹 
            return true
        } else if (typeA !== typeB) {
            return 'error'
        } else {
            // 同类型比较大小
            const valueToNumber: any = {

                'three': 3,
                'four': 4,
                'five': 5,
                'six': 6,
                'seven': 7,
                'eight': 8,
                'nine': 9,
                'ten': 10,
                'J': 11,
                'Q': 12,
                'K': 13,
                'one': 14,
                'two': 15,
                "SmallGhost": 140,
                'BigGhost': 150
            }
            let spA = Utils.SpcialSort(cardListA)
            let spB = Utils.SpcialSort(cardListB)
            return valueToNumber[spA[0].cardValue] < valueToNumber[spB[0].cardValue]
        }
    }
    // 斗地主规则下的排序
    static SpcialSort(cardList: Array<Card>) {
        const type = Utils.judgeType(cardList)
        // 单只 对子 三张 炸弹 王炸 不用特殊处理
        if (type === PlayType.single) {
            return [...cardList]
        } else if (type === PlayType.pairs) {
            return [...cardList]
        } else if (type === PlayType.three) {
            return [...cardList]
        } else if (type === PlayType.bomb) {
            return [...cardList]
        } else if (type === PlayType.king) {
            return [...cardList]
        } else if (type === PlayType.threeWithOne) {
            let keyNumber: Record<string, number> = {}
            let big: Array<string> = []
            let small: Array<string> = []
            // 三带一
            cardList.forEach(card => {
                keyNumber[card.cardValue] = cardList.filter(item => item.cardValue === card.cardValue).length
                if (keyNumber[card.cardValue] === 3 && !big.includes(card.cardValue)) {
                    big.push(card.cardValue)
                } else if (keyNumber[card.cardValue] === 1 && !small.includes(card.cardValue)) {
                    small.push(card.cardValue)
                }
            })
            // 从大到小
            big = Utils.sortedCardValue(big)
            small = Utils.sortedCardValue(small)
            let ans: Array<Card> = []
            for (let i = 0; i < big.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === big[i])]
            }
            for (let i = 0; i < small.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === small[i])]
            }

            return ans
        } else if (type === PlayType.threeWithTwo) {
            // 三带二
            let keyNumber: Record<string, number> = {}
            let big: Array<string> = []
            let small: Array<string> = []
            // 三带一
            cardList.forEach(card => {
                keyNumber[card.cardValue] = cardList.filter(item => item.cardValue === card.cardValue).length
                if (keyNumber[card.cardValue] === 3 && !big.includes(card.cardValue)) {
                    big.push(card.cardValue)
                } else if (keyNumber[card.cardValue] === 2 && !small.includes(card.cardValue)) {
                    small.push(card.cardValue)
                }
            })
            // 从大到小
            big = Utils.sortedCardValue(big)
            small = Utils.sortedCardValue(small)
            let ans: Array<Card> = []
            for (let i = 0; i < big.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === big[i])]
            }
            for (let i = 0; i < small.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === small[i])]
            }

            return ans
        } else if (type === PlayType.threeStarightWithTwo) {
            // 三顺带二
            let keyNumber: Record<string, number> = {}
            let big: Array<string> = []
            let small: Array<string> = []
            cardList.forEach(card => {
                keyNumber[card.cardValue] = cardList.filter(item => item.cardValue === card.cardValue).length
                if (keyNumber[card.cardValue] === 3 && !big.includes(card.cardValue)) {
                    big.push(card.cardValue)
                } else if ((keyNumber[card.cardValue] === 1 || keyNumber[card.cardValue] === 2) && !small.includes(card.cardValue)) {
                    small.push(card.cardValue)
                }
            })
            big = Utils.sortedCardValue(big)
            small = Utils.sortedCardValue(small)
            let ans: Array<Card> = []
            for (let i = 0; i < big.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === big[i])]
            }
            for (let i = 0; i < small.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === small[i])]
            }
            return ans
        } else if (type === PlayType.threeStarightWithFour) {
            // 三顺带对子
            let keyNumber: Record<string, number> = {}
            let big: Array<string> = []
            let small: Array<string> = []
            cardList.forEach(card => {
                keyNumber[card.cardValue] = cardList.filter(item => item.cardValue === card.cardValue).length
                if (keyNumber[card.cardValue] === 3 && !big.includes(card.cardValue)) {
                    big.push(card.cardValue)
                } else if (keyNumber[card.cardValue] === 2 && !small.includes(card.cardValue)) {
                    small.push(card.cardValue)
                }
            })
            big = Utils.sortedCardValue(big)
            small = Utils.sortedCardValue(small)
            let ans: Array<Card> = []
            for (let i = 0; i < big.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === big[i])]
            }
            for (let i = 0; i < small.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === small[i])]
            }
            return ans
        } else if (type === PlayType.fourSameWithTwo) {
            // 四带二
            let keyNumber: Record<string, number> = {}
            let big: Array<string> = []
            let small: Array<string> = []
            cardList.forEach(card => {
                keyNumber[card.cardValue] = cardList.filter(item => item.cardValue === card.cardValue).length
                if (keyNumber[card.cardValue] === 4 && !big.includes(card.cardValue)) {
                    big.push(card.cardValue)
                } else if (keyNumber[card.cardValue] === 2 && !small.includes(card.cardValue)) {
                    small.push(card.cardValue)
                }
            })
            big = Utils.sortedCardValue(big)
            small = Utils.sortedCardValue(small)
            let ans: Array<Card> = []
            for (let i = 0; i < big.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === big[i])]
            }
            for (let i = 0; i < small.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === small[i])]
            }
            return ans
        } else if (type === PlayType.threeStaright) {
            // 三顺
            let keyNumber: Record<string, number> = {}
            let big: Array<string> = []
            let small: Array<string> = []
            cardList.forEach(card => {
                keyNumber[card.cardValue] = cardList.filter(item => item.cardValue === card.cardValue).length
                if (keyNumber[card.cardValue] === 3 && !big.includes(card.cardValue)) {
                    big.push(card.cardValue)
                } else if (keyNumber[card.cardValue] === 2 && !small.includes(card.cardValue)) {
                    small.push(card.cardValue)
                }
            })
            big = Utils.sortedCardValue(big)
            small = Utils.sortedCardValue(small)
            let ans: Array<Card> = []
            for (let i = 0; i < big.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === big[i])]
            }
            for (let i = 0; i < small.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === small[i])]
            }
            return ans
        } else if (type === PlayType.twoStraight) {
            // 二顺
            let keyNumber: Record<string, number> = {}
            let big: Array<string> = []

            cardList.forEach(card => {
                keyNumber[card.cardValue] = cardList.filter(item => item.cardValue === card.cardValue).length
                if (keyNumber[card.cardValue] === 2 && !big.includes(card.cardValue)) {
                    big.push(card.cardValue)
                }
            })
            big = Utils.sortedCardValue(big)

            let ans: Array<Card> = []
            for (let i = 0; i < big.length; i++) {
                ans = [...ans, ...cardList.filter(item => item.cardValue === big[i])]
            }

            return ans
        }
        return cardList
    }
    static judgeType(cardList: Array<Card>) {

        if (cardList.length === 0) {
            return 'others'
        } else if (cardList.length === 1) {
            // 单张
            return PlayType.single
        } else if (cardList.length === 2) {
            // 对子 炸弹
            if (cardList[0].cardValue === VALUE.BigGhost && cardList[1].cardValue === VALUE.SmallGhost) {
                return PlayType.king
            } else if (cardList[1].cardValue === VALUE.BigGhost && cardList[0].cardValue === VALUE.SmallGhost) {
                return PlayType.king
            } else {
                return cardList[0].cardValue === cardList[1].cardValue ? PlayType.pairs : 'others'
            }

        } else if (cardList.length === 3) {
            // 三张
            if (cardList[0].cardValue === cardList[1].cardValue && cardList[1].cardValue === cardList[2].cardValue) {
                return PlayType.three
            } else {
                return 'others'
            }
        } else if (cardList.length === 4) {
            // 炸弹 或者三带一
            if (cardList.filter(item => item.cardValue === cardList[0].cardValue).length === 4) {
                return PlayType.bomb
            } else if (cardList.filter(item => item.cardValue === cardList[0].cardValue).length === 3 ||
                cardList.filter(item => item.cardValue === cardList[3].cardValue).length === 3) {
                return PlayType.threeWithOne
            } else {
                return 'others'
            }
        } else if (cardList.length === 5) {
            // 三带二 或者单顺
            const sameNumber = Utils.sameNumber(cardList.map(item => item.cardValue))
            console.log(sameNumber, cardList)
            if (Object.keys(sameNumber).length === 5 && Utils.isSingle(cardList)) {
                return PlayType.oneStraight
            } else if (Object.keys(sameNumber).length === 2 && sameNumber[Object.keys(sameNumber)[0]] === 3 && sameNumber[Object.keys(sameNumber)[1]] === 2) {
                return PlayType.threeWithTwo
            } else if (Object.keys(sameNumber).length === 2 && sameNumber[Object.keys(sameNumber)[0]] === 2 && sameNumber[Object.keys(sameNumber)[1]] === 3) {
                return PlayType.threeWithTwo
            } else {
                return 'others'
            }
        } else if (cardList.length === 6) {
            const sameNumber = Utils.sameNumber(cardList.map(item => item.cardValue))

            const sortObj = Object.keys(sameNumber).map(key => {
                return { number: sameNumber[key], key: key }
            }).sort((a, b) => {
                return a.number - b.number
            })

            console.log(sortObj)
            const sortNumber = sortObj.map(item => item.number)
            const sortKey = sortObj.map(item => item.key)
            // console.log(sameNumber, sortNumber)
            // 单顺 三顺 四带二 二顺
            if (Utils.isSingle(cardList)) {
                return PlayType.oneStraight
            } else if (Object.keys(sameNumber).length === 3 && sortNumber[0] === 2 && sortNumber[1] === 2 && sortNumber[2] === 2 && Utils.isContinue(sortKey)) {
                return PlayType.twoStraight
            } else if (Object.keys(sameNumber).length === 2 && sortNumber[0] === 3 && sortNumber[1] === 3 && Utils.isContinue(sortKey)) {
                return PlayType.threeStaright
            } else if (sortNumber[sortNumber.length - 1] === 4) {
                return PlayType.fourSameWithTwo
            } else {
                return 'others'
            }
        } else if (cardList.length === 7) {
            // 单顺
            return this.isSingle(cardList) ? PlayType.oneStraight : 'others'
        } else if (cardList.length === 8) {
            // 三顺带单只 单顺
            const sameNumber = Utils.sameNumber(cardList.map(item => item.cardValue))

            const sortObj = Object.keys(sameNumber).map(key => {
                return { number: sameNumber[key], key: key }
            }).sort((a, b) => {
                return a.number - b.number
            })
            const sortNumber = sortObj.map(item => item.number)
            const sortKey = sortObj.map(item => item.key)

            if (Object.keys(sameNumber).length === 8 && Utils.isSingle(cardList)) {
                return PlayType.oneStraight
            } else if (Object.keys(sameNumber).length === 4 && sortNumber[0] === 1 && sortNumber[1] === 1 && sortNumber[2] === 3 && sortNumber[3] === 3 && Utils.isContinue(sortKey)) {
                return PlayType.threeStarightWithTwo
            } else {
                return 'others'
            }
        } else if (cardList.length === 9) {
            // 单顺
            return this.isSingle(cardList) ? PlayType.oneStraight : 'others'
        } else if (cardList.length === 10) {
            // 三顺带对子 单顺
            const sameNumber = Utils.sameNumber(cardList.map(item => item.cardValue))
            const sortObj = Object.keys(sameNumber).map(key => {
                return { number: sameNumber[key], key: key }
            }).sort((a, b) => {
                return a.number - b.number
            })
            const sortNumber = sortObj.map(item => item.number)
            const sortKey = sortObj.map(item => item.key)

            if (Object.keys(sameNumber).length === 10 && Utils.isSingle(cardList)) {
                return PlayType.oneStraight
            } else if (Object.keys(sameNumber).length === 4 && sortNumber[0] === 2 && sortNumber[1] === 2 && sortNumber[2] === 3 && sortNumber[3] === 3 && Utils.isContinue(sortKey)) {
                return PlayType.threeStarightWithFour
            } else {
                return 'others'
            }
        } else if (cardList.length === 11) {
            // 单顺
            return this.isSingle(cardList) ? PlayType.oneStraight : 'others'
        } else if (cardList.length === 12) {
            // 单顺
            return this.isSingle(cardList) ? PlayType.oneStraight : 'others'
        } else if (cardList.length > 12) {
            return 'others'
        }
        return 'others'
    }
    // 返回每张牌有几个
    static sameNumber(val: Array<VALUE>) {
        let ans: Record<string, number> = {}

        val.forEach(item => {
            ans[item] = val.filter(value => value === item).length
        })
        return ans
    }
    // 判断是否连续
    static isContinue(keys: Array<string>) {
        const cardValueToNumber: any = {
            'one': 1,
            'two': 2,
            'three': 3,
            'four': 4,
            'five': 5,
            'six': 6,
            'seven': 7,
            'eight': 8,
            'nine': 9,
            'ten': 10,
            'J': 11,
            'Q': 12,
            'K': 13,
        }
        // 先排序
        keys = keys.sort((a, b) => {
            return cardValueToNumber[a] - cardValueToNumber[b]
        })
        let ans = true
        for (let i = 0; i < keys.length - 1; i++) {
            if (cardValueToNumber[keys[i]] + 1 !== cardValueToNumber[keys[i + 1]]) {
                ans = false
                break
            }

        }
        return ans
    }
    static isSingle(cardList: Array<Card>) {
        let value = ['three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'J', 'Q', 'K', 'one']
        let ans = true

        if (cardList.map(item => item.cardValue).includes(VALUE.two)) return false
        for (let i = 0; i < cardList.length - 1; i++) {
            if (i === 0 && cardList[i].cardValue === 'one') continue
            if (value.indexOf(cardList[i].cardValue) + 1 !== value.indexOf(cardList[i + 1].cardValue)) {
                ans = false
                break
            }
        }
        return ans
    }

    static sortCard(cardList: Array<Card>, smallToBig?: boolean) {
        const cardValueToNumber: any = {
            'one': 1,
            'two': 2,
            'three': 3,
            'four': 4,
            'five': 5,
            'six': 6,
            'seven': 7,
            'eight': 8,
            'nine': 9,
            'ten': 10,
            'J': 11,
            'Q': 12,
            'K': 13,
            "SmallGhost": 14,
            'BigGhost': 15
        }
        if (smallToBig) {
            return cardList.sort((a, b) => {
                return cardValueToNumber[a.cardValue] - cardValueToNumber[b.cardValue]
            })
        }
        return cardList.sort((a, b) => {
            return cardValueToNumber[b.cardValue] - cardValueToNumber[a.cardValue]
        })
    }
}