import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSideNavActiveToggleStore = defineStore('sideNavActiveToggle', () => {
    const defaultBgColor=ref("transparent");
    const activeBgColor=ref("#ffffff");

    const homeStyle=ref({backgroundColor: activeBgColor});
    const integrateStyle=ref({backgroundColor: defaultBgColor});
    const reportStyle=ref({backgroundColor: defaultBgColor});

    const resetStyles=()=>{
        homeStyle.value.backgroundColor=defaultBgColor;
        integrateStyle.value.backgroundColor=defaultBgColor;
        reportStyle.value.backgroundColor=defaultBgColor;
    };

    const sideNavHomeClick=()=>{
        resetStyles();
        homeStyle.value.backgroundColor=activeBgColor;
    };
    const sideNavIntegrateClick=()=>{
        resetStyles();
        integrateStyle.value.backgroundColor=activeBgColor;
    };
    const sideNavReportClick=()=>{
        resetStyles();
        reportStyle.value.backgroundColor=activeBgColor;
    };
    return {homeStyle, integrateStyle, reportStyle, sideNavHomeClick, sideNavIntegrateClick, sideNavReportClick};
});