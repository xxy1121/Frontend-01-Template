const css = require('css')

const rules = []

function addCssRules(text) {
    const ast = css.parse(text);
    rules.push(...ast.stylesheet.rules)
    return rules
}

function matchSimpleSelectors(element, selector) {
    if (!element.attributes && !selector) {
        return false
    }
    if (selector.startsWith('#')) {
        const attrId = element.attributes.find(a => a.name === 'id')
        return !!attrId && attrId.value === selector.slice(1)
    } else if (selector.startsWith('.')) {
        const attrClass = element.attributes.find(a => a.name === 'class')
        return !!attrClass && attrClass.value.split(/\s+/g).indexOf(selector.slice(1)) !== -1
    } else {
        return element.tagName === selector
    }
}

function matchCombinators(element, selector) {
    return selector.split(/(?=[.#])/).every(s => matchSimpleSelectors(element, s))
}

function matchRule(element, rule) {
    const selectorParts = rule.selectors[0].split(' ').reverse()
    if (matchCombinators(element, selectorParts[0])) {
        selectorParts.shift()
        element = element.parent
    } else {
        return false
    }
    while (selectorParts.length && element) {
        if (matchCombinators(element, selectorParts[0])) {
            selectorParts.shift()
        }
        element = element.parent
    }
    return selectorParts.length === 0
}

function computeCss(element) {
    element.computedStyle = element.computedStyle || {}
    for (const rule of rules) {
        if (matchRule(element, rule)) {
            rule.declarations.forEach(d => {
                element.computedStyle[d.property] = d.value
            });
        }
    }
    return element
}

module.exports = {
    rules,
    addCssRules,
    computeCss,
}