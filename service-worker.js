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

const deleteOldFixedAlarmName = 'delete-old-fixed'
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== 'install') {
        return;
    }

    await chrome.alarms.create(deleteOldFixedAlarmName, {
        delayInMinutes: 1,
        periodInMinutes: 1
    })
})

chrome.alarms.onAlarm.addListener(async ({ name }) => {
    if(name !== deleteOldFixedAlarmName) {
        return;
    }

    const fixedTabs = await chrome.tabs.query({
        pinned: true,
    })

    const now = new Date();
    now.setDate(now.getDate() - 7)
    for(const tab of fixedTabs) {
        const { lastAccessed } = tab
        if(lastAccessed) {
            const lastAccessedDate = new Date(lastAccessed)
            if(lastAccessedDate < now) {
                const tabId = tab.id
                chrome.tabs.remove(tabId)
            }
        }
    }
})
