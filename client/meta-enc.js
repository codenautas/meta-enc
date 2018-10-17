"use strict";

var PANTALLA_RESUMEN = true;

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
    my.ajax.preguntas_operativo.traer({operativo:result.operativo}).then(function(preguntas){
        var idEnc_js=result.id_caso;
        var idOp_js=result.operativo;
        sessionStorage.setItem('surveyId', idEnc_js);
        sessionStorage.setItem('operativo', idOp_js);
        sessionStorage.setItem('innerPk' , JSON.stringify({}));
        sessionStorage.setItem('formularioPrincipal', result.formulario);
        sessionStorage.setItem('UAInfo', JSON.stringify(preguntas));
        localStorage.setItem(idOp_js + '_survey_' + idEnc_js, JSON.stringify(result.datos_caso));
        div.textContent='Se cargará el caso ' + result.id_caso + '. Redirigiendo...';
        div.style.backgroundColor='#5F5';
        setTimeout(function(){
            gotoInnerUrl('menu?w=formulario&operativo='+result.operativo + '&formulario='+ result.formulario)
        },250);
    });
}

myOwn.wScreens.proc.result.desplegarFormulario=function(surveyStructure, div, surveyData, formId){
    var guardarButton = html.button({id:'guardar', class:'rel_button'}, "Grabar").create();
    guardarButton.onclick=guardar;
    var devolverButton = html.button({id:'devolver', class:'rel_button'}, "Devolver").create();
    devolverButton.onclick=devolver;
    if(PANTALLA_RESUMEN){
        var resumenButton = html.button({id:'summary-button'}, "Resumen").create();
        resumenButton.onclick=verResumen;
    }
    div.appendChild(html.div({class:'prueba-despliegue'},[
        html.link({href: 'css/formularios.css', rel: "stylesheet"}),
        html.link({href: 'css/estados.css'    , rel: "stylesheet"}),
        html.p({id:'genericMsg'},['']),
    ]
    .concat([guardarButton, devolverButton])
    .concat([
        html.p({id:'idCaso'},['N° Caso: ',surveyData.idCaso]),
    ])
    .concat(PANTALLA_RESUMEN?resumenButton:null)
    .concat(my.displayForm(surveyStructure, surveyData, formId, []))
    ).create());
}

function verResumen() {
    document.getElementById('main-form-wrapper').setAttribute('summary',true);
    document.getElementById('summary-button').onclick = quitarResumen;
}

function quitarResumen() {
    document.getElementById('main-form-wrapper').setAttribute('summary', false);
    document.getElementById('summary-button').onclick = verResumen;
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
        gotoInnerUrl('menu?i=encuestas%20de%20prueba,caso_traer');
    });
}

function guardar(){
    var surveyId = sessionStorage.getItem('surveyId');
    var operativo = sessionStorage.getItem('operativo');
    var datosCaso = JSON.parse(localStorage.getItem(operativo + '_survey_' + surveyId));
    return my.ajax.caso.guardar({operativo: operativo, id_caso: surveyId, datos_caso: datosCaso}) 
    .then(function(result){
        document.getElementById('genericMsg').textContent='Encuesta guardada';
        return result;
    })
    .catch(function(error){ 
        document.getElementById('genericMsg').textContent='Hubo un problema, intente nuevamente.';
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
            if(surveyData.idCaso && surveyData.surveyContent){
                main_layout.innerHTML='';
                my.wScreens.proc.result.desplegarFormulario(structOperativo,main_layout,surveyData,formulario); //MODIFICADO
            }else{
                gotoInnerUrl('menu?i=encuestas%20de%20prueba,caso_traer');
            }
        });
    }else{
        gotoInnerUrl('menu?i=encuestas%20de%20prueba,caso_traer');
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
    formManager.setIrAlSiguienteAutomatico(false);
    var toDisplay = formManager.display();
    formManager.validateDepot();
    formManager.refreshState();
    var img = html.img({id:'summary-img', src:my.path.img + 'local-resumen.png', alt:'imagen resumen'}).create();
    var pantallaResumen = html.div({id:'summary'}, img);
    return html.div({id: 'main-form-wrapper'},[html.div({id: mainFormId}, [toDisplay]), PANTALLA_RESUMEN?pantallaResumen:null]);
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