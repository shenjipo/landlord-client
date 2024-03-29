export enum FLOWER {
    spade = 'spade', // 黑桃
    wintersweet = 'wintersweet', // 梅花
    block = 'block', // 方块
    heart = 'heart', // 红桃
    ghost = 'ghost'
}
export enum STATE {
    up = 'up',
    normal = 'noraml',
    hidden = 'hidden'
}
export enum VALUE {
    one = 'one',
    two = 'two',
    three = 'three',
    four = 'four',
    five = 'five',
    six = 'six',
    seven = 'seven',
    eight = 'eight',
    nine = 'nine',
    ten = 'ten',
    J = 'J',
    Q = 'Q',
    K = 'K ',
    SmallGhost = 'SmallGhost',
    BigGhost = 'BigGhost'

}
export enum PlayType {
    king = 'king', // 王炸
    bomb = 'bomb', // 炸弹
    fourSameWithTwo = 'fourSameWithTwo', // 四带二
    threeStaright = 'threeStaright', // 三顺 444555
    threeStarightWithTwo = 'threeStarightWithTwo', // 三顺带单只  3334449K
    threeStarightWithFour = 'threeStarightWithFour', // 三顺带对子 3334445566
    twoStraight = 'twoStraight', //  二顺 223344
    oneStraight = 'oneStraight', // 单顺 34567 不能带2
    threeWithTwo = 'threeWithTwo', // 三代二
    threeWithOne = 'threeWithOne', // 三代一
    three = 'three',
    pairs = 'pairs',
    single = 'single',
}
export interface Card {
    cardClass: string,
    cardType: FLOWER,
    cardState: string,
    cardValue: VALUE,
    left: string,
    right: string
}
export const CardClass: any = {
    'spade': {
        'one': 'spade-one',
        'two': 'spade-two',
        'three': 'spade-three',
        'four': 'spade-four',
        'five': 'spade-five',
        'six': 'spade-six',
        'seven': 'spade-seven',
        'eight': 'spade-eight',
        'nine': 'spade-nine',
        'ten': 'spade-ten',
        'J': 'spade-J',
        'Q': 'spade-Q',
        'K': 'spade-K',
    },
    'wintersweet': {
        'one': 'wintersweet-one',
        'two': 'wintersweet-two',
        'three': 'wintersweet-three',
        'four': 'wintersweet-four',
        'five': 'wintersweet-five',
        'six': 'wintersweet-six',
        'seven': 'wintersweet-seven',
        'eight': 'wintersweet-eight',
        'nine': 'wintersweet-nine',
        'ten': 'wintersweet-ten',
        'J': 'wintersweet-J',
        'Q': 'wintersweet-Q',
        'K': 'wintersweet-K',
    },
    'block': {
        'one': 'block-one',
        'two': 'block-two',
        'three': 'block-three',
        'four': 'block-four',
        'five': 'block-five',
        'six': 'block-six',
        'seven': 'block-seven',
        'eight': 'block-eight',
        'nine': 'block-nine',
        'ten': 'block-ten',
        'J': 'block-J',
        'Q': 'block-Q',
        'K': 'block-K',
    },
    'heart': {
        'one': 'heart-one',
        'two': 'heart-two',
        'three': 'heart-three',
        'four': 'heart-four',
        'five': 'heart-five',
        'six': 'heart-six',
        'seven': 'heart-seven',
        'eight': 'heart-eight',
        'nine': 'heart-nine',
        'ten': 'heart-ten',
        'J': 'heart-J',
        'Q': 'heart-Q',
        'K': 'heart-K',
    },
    'ghost': {
        'SmallGhost': 'ghost-small',
        'BigGhost': 'ghost-big',
    }
}