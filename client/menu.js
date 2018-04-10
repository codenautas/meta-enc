"use strict";

myOwn.SurveyManager = require('form-structure').SurveyManager;
myOwn.FormManager = require('form-structure').FormManager;

function gotoInnerUrl(innerUrl){
    history.pushState(null, null, innerUrl);
    my.showPage();
}

function onclickUrl(event){
    if(!event.ctrlKey){
        gotoInnerUrl(this.href);
        event.preventDefault();
    }
}

myOwn.wScreens.proc.result.goToEnc=function(result, div){
    my.ajax.cargar.preguntas_operativo({operativo:result.operativo}).then(function(preguntas){
        var idEnc_js=result.id_caso;
        var idOp_js=result.operativo;
        sessionStorage.setItem('surveyId', idEnc_js);
        sessionStorage.setItem('operativo', idOp_js);
        sessionStorage.setItem('innerPk' , JSON.stringify({}));
        sessionStorage.setItem('formularioPrincipal', result.formulario);
        sessionStorage.setItem('UAInfo', JSON.stringify(preguntas));
        localStorage.setItem(idOp_js + '_survey_' + idEnc_js, JSON.stringify(result.datos_caso));
        div.innerText='Se cargará el caso ' + result.id_caso + '. Redirigiendo...';
        div.style.backgroundColor='#5F5';
        setTimeout(function(){
            gotoInnerUrl('menu?w=formulario&operativo='+result.operativo + '&formulario='+ result.formulario)
        },1500);
    });
}

myOwn.wScreens.proc.result.desplegarFormulario=function(surveyStructure, div, surveyData, formId){
    var guardarButton = html.button({id:'guardar', class:'rel_button'}, "Grabar").create();
    guardarButton.onclick=guardar;
    var devolverButton = html.button({id:'devolver', class:'rel_button'}, "Devolver").create();
    devolverButton.onclick=devolver;
    div.appendChild(html.div({class:'prueba-despliegue'},[
        html.link({href: 'css/formularios.css', rel: "stylesheet"}),
        html.link({href: 'css/estados.css'    , rel: "stylesheet"})
    ]
    .concat([guardarButton, devolverButton])
    .concat(my.displayForm(surveyStructure, surveyData, formId, []))
    ).create());
}

function devolver() {
    guardar().then(function(result){
        var surveyId = sessionStorage.getItem('surveyId');
        var operativo = sessionStorage.getItem('operativo');
        sessionStorage.setItem('surveyId', '');
        sessionStorage.setItem('innerPk', '');
        sessionStorage.setItem('operativo', '');
        sessionStorage.setItem('UAInfo', '');
        localStorage.setItem(operativo + '_survey_' + surveyId, '');
        gotoInnerUrl('menu?i=cargar_enc');
    });
}

function guardar(){
    var surveyId = sessionStorage.getItem('surveyId');
    var operativo = sessionStorage.getItem('operativo');
    var datosCaso = JSON.parse(localStorage.getItem(operativo + '_survey_' + surveyId));
    return my.ajax.datos.guardar({operativo: operativo, id_caso: surveyId, datos_caso: datosCaso}) 
    .then(function(result){
        document.getElementById('genericMsg').innerText='Encuesta guardada';
        return result;
    })
    .catch(function(error){ 
        document.getElementById('genericMsg').innerText='Hubo un problema, intente nuevamente.';
    })
}

myOwn.wScreens.formulario=function(addrParams){
    var my=this;
    main_layout.textContent='cargando...';
    var operativo = addrParams.operativo || sessionStorage.getItem('operativo') || null;
    var formulario = addrParams.formulario || sessionStorage.getItem('formularioPrincipal') || null;
    if(operativo && formulario){
        Promise.all([
            my.ajax.operativo.estructura({operativo:operativo}),
            myOwn.getSurveyData(),
        ]).then(function(all){
            var structOperativo=all[0];
            var surveyData=all[1];
            main_layout.innerHTML='';
            my.wScreens.proc.result.desplegarFormulario(structOperativo,main_layout,surveyData,formulario); //MODIFICADO
        });
    }else{
        gotoInnerUrl('menu?i=cargar_enc');
    }
};

myOwn.wScreens.cambio_for=function(addrParams){
    var surveyId = sessionStorage.getItem('surveyId');
    var innerPk = JSON.parse(sessionStorage.getItem('innerPk')||'{"persona": 0}');
    var delta = Number(addrParams.delta);
    var newFormId = Number(innerPk.persona) + delta;
    if(addrParams.absoluta){
        newFormId = addrParams.absoluta - 1 || 0;
    }
    if(newFormId<0){
        newFormId = 0;
    }
    if(delta>0){
        var surveyData = JSON.parse(localStorage.getItem(operativo + '_survey_'+ surveyId)); //REVISAR si se puede sacar todo
        if(newFormId>surveyData.forms.F2.length){
            newFormId=surveyData.forms.F2.length;
        }
    }
    innerPk.persona=newFormId;
    sessionStorage.setItem('innerPk', JSON.stringify(innerPk));
    gotoInnerUrl('./menu?i=personas');
}

myOwn.displayForm = function displayForm(surveyStructure, surveyData, formId, pilaDeRetroceso){
    var mainFormId = 'main-form';
    var surveyMetadata = {
        operative: sessionStorage.getItem('operativo'),
        structure: surveyStructure,
        mainForm: formId,
        analysisUnitStructure: JSON.parse(sessionStorage.getItem('UAInfo'))
    }
    var surveyManager = new this.SurveyManager(surveyMetadata, surveyData.idCaso, surveyData.surveyContent);
    var formManager = new this.FormManager(surveyManager, formId, surveyData.surveyContent, []);
    var toDisplay = formManager.display();
    formManager.validateDepot();
    formManager.refreshState();
    return [html.div({id: mainFormId}, toDisplay)]
}

myOwn.surveyDataEmpty = function surveyDataEmpty(surveyId){
    return JSON.stringify({
        idCaso:surveyId,
        surveyContent:{}
    })
};

myOwn.getSurveyData = function getSurveyData(){
    var my = this;
    var surveyId = sessionStorage.getItem('surveyId');
    var operativo = sessionStorage.getItem('operativo');
    var surveyContent = JSON.parse(localStorage.getItem(operativo + '_survey_' + surveyId)||my.surveyDataEmpty(surveyId));
    return {idCaso:surveyId, /*innerPk:innerPk,*/ surveyContent:surveyContent};
}