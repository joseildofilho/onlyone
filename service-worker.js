chrome.tabs.onCreated.addListener(async (tab) => {
    const allTabs = await chrome.tabs.query({})
    const fixedTabs = await chrome.tabs.query({
        pinned: true,
    })

    const numberOfOpenTabs = allTabs.length - fixedTabs.length 

    if(Math.abs(numberOfOpenTabs) > 3) {
        const tabId = tab.id
        chrome.tabs.remove(tabId)
    }
})
