"use strict";

var PANTALLA_RESUMEN = false;
const MAIN_FORM_ID = 'main-form';
import * as formStructure from "rel-enc/dist/client/form-structure";
import { changing } from "best-globals";
var SurveyManager = formStructure.SurveyManager;
var FormManager = formStructure.FormManager;

function gotoInnerUrl(innerUrl:string){
    history.pushState(null, null, innerUrl);
    my.showPage();
}
 function onclickUrl(event){
    if(!event.ctrlKey){
        gotoInnerUrl(this.href);
        event.preventDefault();
    }
}
 myOwn.wScreens.proc.result.goToEnc=async function(result, div, opts){
    var operativo=result.operativo;
    let UAInfo = my.getLocalVar('UAInfo_'+ operativo);
    var preguntas = UAInfo? UAInfo: await my.ajax.preguntas_operativo_traer({operativo:operativo});

    var idCaso=result.id_caso;
    my.setSessionVar('surveyId', idCaso);
    my.setSessionVar('operativo', operativo);
    my.setSessionVar('innerPk' , {});
    my.setLocalVar('formularioPrincipal_' + operativo, result.formulario);
    my.setLocalVar('UAInfo_'+ operativo, preguntas);
    my.setLocalVar('survey_opts', opts || {buttons:{guardar:true,devolver:true}});
    my.setLocalVar(operativo + '_survey_' + idCaso, result.datos_caso);
    div.textContent='Se cargará el caso ' + result.id_caso + '. Redirigiendo...';
    div.style.backgroundColor='#5F5';
    setTimeout(function(){
        gotoInnerUrl(my.menup+'w=formulario&id_caso=' + idCaso + '&operativo='+operativo + '&formulario='+ result.formulario)
    },250);
}
 myOwn.wScreens.proc.result.desplegarFormulario=function(surveyStructure:formStructure.SurveyStructure, div:HTMLDivElement, surveyData:any, formId:string, formManager?:formStructure.FormManager, toDisplay?:HTMLElement){
    var surveyOpts = my.getLocalVar('survey_opts') || {buttons:{guardar:true,devolver:true}};
    var guardarButton;
    var guardarBottomButton;
    var devolverButton;
    var devolverBottomButton;
    if(surveyOpts.buttons.guardar){
        guardarButton = html.button({id:'guardar-top-button', class:['rel_button', 'guardar']}, "Grabar").create();
        guardarBottomButton = html.button({id:'guardar-bottom-button', class:['rel_button', 'guardar']}, "Grabar").create();
        guardarButton.onclick=guardar;    
        guardarBottomButton.onclick=guardar;
    }
    if(surveyOpts.buttons.devolver){
        devolverButton = html.button({id:'devolver-top-button', class:['rel_button', 'devolver']}, "Devolver").create();
        devolverBottomButton = html.button({id:'devolver-bottom-button', class:['rel_button', 'devolver']}, "Devolver").create();
        devolverButton.onclick=devolver;
        devolverBottomButton.onclick=devolver;
    }
    if(PANTALLA_RESUMEN){
        var resumenButton = html.button({id:'summary-button'}, "Resumen").create();
        resumenButton.onclick=verResumen;
        document.getElementById('total-layout').appendChild(resumenButton);
    }
    if(!toDisplay && !formManager){
        var {toDisplay, formManager}=my.displayForm(surveyStructure, surveyData, formId, []);
    }

    var pantallaResumen = PANTALLA_RESUMEN?html.div({id:'summary'}, my.displaySummary(surveyMetadata.operative, surveyData.idCaso)):null;
    var formElementsToDisplay = html.div({id: 'main-form-wrapper'},[html.div({id: MAIN_FORM_ID}, [toDisplay]), pantallaResumen]);
    div.appendChild(html.div({class:'prueba-despliegue'},[
        html.p({id:'genericMsg'},['']),
    ]
    .concat([guardarButton, devolverButton])
    .concat([
        html.p({id:'idCaso'},['N° Caso: ',surveyData.idCaso]),
        formElementsToDisplay
    ])
    .concat([guardarBottomButton, devolverBottomButton])
    ).create());
    formManager.irAlSiguienteDespliegue(formManager.state.primeraVacia,devolverBottomButton);
    SurveyManager.performCustomActionForLoadedFormManager(formManager);
    formManager.refreshGlobalState();
}
 function verResumen() {
    var summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML= '';
    var summary = my.displaySummary(my.getSessionVar('operativo'), my.getSessionVar('surveyId'));
    summaryDiv.appendChild(summary);
    document.getElementById('main-form-wrapper').setAttribute('summary',true);
    document.getElementById('summary-button').onclick = quitarResumen;
}
 function quitarResumen() {
    document.getElementById('main-form-wrapper').setAttribute('summary', false);
    document.getElementById('summary-button').onclick = verResumen;
}
 function devolver() {
    guardar().then(function(result){
        var surveyId = my.getSessionVar('surveyId');
        var operativo = my.getSessionVar('operativo');
        //my.setSessionVar('surveyId', ''); /* lo comento para que recuerde el anterior*/
        my.setSessionVar('innerPk', '');
        my.setSessionVar('operativo', '');
        my.setLocalVar('UAInfo_'+ operativo, '');
        my.setLocalVar(operativo + '_survey_' + surveyId, '');
        var idCaso = my.getSessionVar('surveyId');
        gotoInnerUrl(my.menup+'w=ingresarFormulario&operativo='+JSON.stringify(operativo)+'&consistir='+idCaso);
    });
}
 function guardar(){
    var surveyId = my.getSessionVar('surveyId');
    var operativo = my.getSessionVar('operativo');
    var datosCaso = my.getLocalVar(operativo + '_survey_' + surveyId));
    return my.ajax.caso_guardar({operativo: operativo, id_caso: surveyId, datos_caso: datosCaso}) 
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
    var idCaso = addrParams.id_caso;
    var operativo = addrParams.operativo || my.getSessionVar('operativo') || null;
    my.setSessionVar('operativo',operativo);
    my.setSessionVar('id_caso',idCaso);
    var formulario = addrParams.formulario || my.getLocalVar('formularioPrincipal_' + operativo) || null;
    if(operativo && formulario){
        var surveyStructure:formStructure.SurveyStructure = my.getLocalVar('estructura-'+operativo));
        var surveyData = myOwn.getSurveyData(operativo, idCaso);
        Promise.all([
            surveyStructure || my.ajax.operativo_estructura({operativo:operativo}),
            surveyData
        ]).then(function(all){
            var structOperativo=all[0];
            var surveyData=all[1];
            if(idCaso && surveyData.surveyContent){
                main_layout.innerHTML='';
                my.wScreens.proc.result.desplegarFormulario(structOperativo,main_layout,surveyData,formulario); //MODIFICADO
            }else{

                gotoInnerUrl(my.menup+'w=ingresarFormulario');
            }
        });
    }else{
        gotoInnerUrl(my.menup+'w=ingresarFormulario');
    }
    
    
};
 myOwn.wScreens.cambio_for=function(addrParams){
    // ******************* ANTES QUE NADA ************************
    // ***** revisar si esta función se sigue usando *************
    // ***********************************************************
    var surveyId = my.getSessionVar('surveyId');
    //TODO: s.especial https://github.com/codenautas/meta-enc/issues/1 
    // acá habría que parametriza el módulo poniendo cuál es la innerPK default y que '{"persona": 0}' vaya a ese parámetro
    var innerPk = my.getSessionVar('innerPk')||{"persona": 0}; 
    //TODO: s.especial https://github.com/codenautas/meta-enc/issues/1 
    // acá habría que ver si nombre del atributo "persona" no se puede parametrizar
    var delta = Number(addrParams.delta);
    var newFormId = Number(innerPk.persona) + delta;
    if(addrParams.absoluta){
        newFormId = addrParams.absoluta - 1 || 0;
    }
    if(newFormId<0){
        newFormId = 0;
    }
    if(delta>0){
        var surveyData = my.getLocalVar(operativo + '_survey_'+ surveyId)); //REVISAR si se puede sacar todo
        if(newFormId>surveyData.forms.F2.length){
            newFormId=surveyData.forms.F2.length;
        }
    }
    innerPk.persona=newFormId;
    my.setSessionVar('innerPk', innerPk);
    gotoInnerUrl('./menu?i=personas');
}
myOwn.displayForm = function displayForm(surveyStructure, surveyData, formId, pilaDeRetroceso){
    var operativo = my.getSessionVar('operativo');
    var surveyMetadata = {
        operative: operativo,
        structure: surveyStructure,
        mainForm: formId,
        analysisUnitStructure: my.getLocalVar('UAInfo_'+ operativo))
    }
    var surveyManager = new SurveyManager(surveyMetadata, surveyData.idCaso, surveyData.surveyContent);
    var {toDisplay, formManager} = myOwn.displayFormCommonPart(surveyManager, formId, surveyData.surveyContent, []);
    //var pantallaResumen = PANTALLA_RESUMEN?html.div({id:'summary'}, my.displaySummary(surveyMetadata.operative, surveyData.idCaso)):null;
    return {
        toDisplay:toDisplay,
        formManager: formManager
    }
}
myOwn.displayFormCommonPart = function displayFormCommonPart(surveyManager, formId, formData, navigationStack){
    var formManager = new FormManager(surveyManager, formId, formData, navigationStack);
    var toDisplay = formManager.display();
    formManager.validateDepot();
    formManager.refreshState();
    return {toDisplay, formManager};
}
 myOwn.displaySummary = function displaySummary(operativo:string, surveyId:string){
    var mySurvey = my.getLocalVar(operativo +'_survey_'+surveyId));
    //return html.img({id:'summary-img', src:my.path.img + 'local-resumen.png', alt:'imagen resumen'}).create();
    var table = html.table({id:'summary-table'},[
        html.tr({},[
            html.th({},'año'),
            html.th({},'edad'),
            html.th({},'lugar'),
            html.th({colspan:6},'vivienda'),
            html.th({colspan:3},'educ'),
            html.th({colspan:6},'trabajo'),
            html.th({colspan:4},'conv')
        ])
    ]).create();
    if(mySurvey.personas[0]){
        var persona = mySurvey.personas[0];
        if(persona.p3a){ //TODO: s.especial https://github.com/codenautas/meta-enc/issues/1
            var fechaNac = persona.p3a;
            var fechaNacArray = fechaNac.split('-');
            var date = new Date();
            var j=0;
            for(var i=fechaNacArray[0];i<=date.getFullYear();i++){
                var attrs = j%10==0?{'ten-years':true}:{}
                table.appendChild(
                    html.tr(attrs,[
                        html.td({'is-first':true, 'is-last':true},i),
                        html.td({'is-first':true, 'is-last':true},j),
                    ].concat(my.completarLugares(persona, i, j))
                    .concat(my.completarViviendas(persona, i, j))
                    .concat(my.completarEducacion(persona, i, j))
                    .concat(my.completarTrabajo(persona, i, j))
                    .concat(my.completarConvivencia(persona, i, j))
                    ).create()
                );
                j++;
            }
        }
     }
    return table;
}
//TODO: s.especial https://github.com/codenautas/meta-enc/issues/1 Esta función debería estar afuera
myOwn.completarLugares = function completarLugares(persona, year, age){
    if(age == 0){
        return [html.td({},persona['2_1'])];
    }else{
        var result = persona['annios_personas'].find(function(annioPersona){
            return annioPersona['2a'] == year || annioPersona['2b'] == age;
        })
        return [html.td({'is-first':true, 'is-last':true},result?result['2_3']:'')];
    }
}
//TODO: s.especial https://github.com/codenautas/meta-enc/issues/1 Estas funciones "completar" deberían estar afuera
myOwn.completarViviendas = function completarViviendas(persona, year, age){
    var result = persona['annios_personas'].find(function(annioPersona){
        return annioPersona['3a'] == year || annioPersona['3b'] == age;
    })
    return [
        html.td({'is-first':true},result?result['3_2']:''),
        html.td({},result?result['3_3']:''),
        html.td({},result?result['3_4']:''),
        html.td({},result?result['3_5']:''),
        html.td({},result?result['3_6']:''),
        html.td({'is-last':true},result?result['3_7']:'')
    ]
}
myOwn.completarEducacion = function completarEducacion(persona, year, age){
    var result = persona['annios_personas'].find(function(annioPersona){
        return annioPersona['4a'] == year || annioPersona['4b'] == age;
    })
    return [
        html.td({'is-first':true},result?result['4_2']:''),
        html.td({},result?result['4_3']:''),
        html.td({'is-last':true},result?result['4_4']:'')
    ]
}
myOwn.completarTrabajo = function completarTrabajo(persona, year, age){
    var result = persona['annios_personas'].find(function(annioPersona){
        return annioPersona['6a'] == year || annioPersona['6b'] == age;
    })
    return [
        html.td({'is-first':true},result?result['6_2a']:''),
        html.td({},result?result['6_2b']:''),
        html.td({},result?result['6_2c']:''),
        html.td({},result?result['6_2d']:''),
        html.td({},result?result['6_2e']:''),
        html.td({'is-last':true},result?result['6_3']:'')
    ]
}
myOwn.completarConvivencia = function completarConvivencia(persona, year, age){
    var result = persona['annios_personas'].find(function(annioPersona){
        return annioPersona['7a'] == year || annioPersona['7b'] == age;
    })
    return [
        html.td({'is-first':true},result?result['7_3']:''),
        html.td({},result?result['7_4']:''),
        html.td({},result?result['7_5']:''),
        html.td({'is-last':true},result?result['7_6']:''),
    ]
}
myOwn.surveyDataEmpty = function surveyDataEmpty(surveyId){
    return JSON.stringify({
        idCaso:surveyId,
        surveyContent:{}
    })
};
myOwn.getSurveyData = function getSurveyData(operativo:string,idCaso:string):formStructure.SurveyData{
    var surveyContent = my.getLocalVar(operativo + '_survey_' + idCaso));
    var surveyData = {idCaso:idCaso, surveyContent:surveyContent}
    return surveyData;
}
myOwn.wScreens.loadForm=async function(addrParams){
    var idCaso = addrParams.idCaso;
    var formId = addrParams.formId;
    var urlNavigationStack: formStructure.URLNavigationStack[] = JSON.parse(addrParams.navigationStack);
    var operativo = addrParams.operativo;
    var unidadAnalisis = addrParams.unidadAnalisis;
    var iPosition = addrParams.iPosition;
    var surveyStructure:formStructure.SurveyStructure = my.getLocalVar('estructura-'+operativo));
    var formPrincipal=my.getLocalVar('formularioPrincipal_' + operativo);
    var uaInfo=my.getLocalVar('UAInfo_'+ operativo));
    var datosCaso:any;
    if(!formPrincipal && !uaInfo){
        var result:any = await my.ajax.caso_traer({operativo:operativo, id_caso: idCaso});
        datosCaso = result.datos_caso;
        var preguntas:any = await my.ajax.preguntas_operativo_traer({operativo:result.operativo});
        my.setLocalVar('formularioPrincipal_' + operativo, result.formulario);
        my.setLocalVar('UAInfo_'+ operativo, preguntas);
    }else{
        datosCaso=my.getLocalVar(operativo+'_survey_'+idCaso));
    }
    my.setSessionVar('surveyId', idCaso);
    my.setSessionVar('operativo', operativo);
    my.setSessionVar('innerPk' , {});
    var surveyOpts = my.getLocalVar('survey_opts'));
    if(!surveyOpts){
        my.setLocalVar('survey_opts', {buttons:{guardar:true,devolver:true}});
    }
    my.setLocalVar(operativo + '_survey_' + idCaso, datosCaso);
    my.removeSessionVar('ultimo-formulario-cargado');
    var surveyData:formStructure.SurveyData = myOwn.getSurveyData(operativo,idCaso);
    var surveyMetadata:formStructure.SurveyMetadata = {
        operative: operativo,
        structure: surveyStructure,
        mainForm: my.getLocalVar('formularioPrincipal_' + operativo),
        analysisUnitStructure: my.getLocalVar('UAInfo_'+ operativo))
    }
    var surveyManager = new SurveyManager(surveyMetadata, surveyData.idCaso, surveyData.surveyContent);
    var formData:any = surveyManager.surveyData;
    var navigationStack:formStructure.NavigationStack[] = []
    for(var i=urlNavigationStack.length-1;  i>=0; i--){
        if(urlNavigationStack[i].formId != formPrincipal){
            formData = formData[urlNavigationStack[i].analysisUnit]?formData[urlNavigationStack[i].analysisUnit][urlNavigationStack[i].iPosition-1]:formData;
        }
        var stackElement: formStructure.NavigationStack = urlNavigationStack[i];
        stackElement.formData = formData;
        stackElement.callerElement = null;
        navigationStack.unshift(stackElement);
    }
    if(urlNavigationStack.length){
        formData = formData[unidadAnalisis]?formData[unidadAnalisis][iPosition-1]:formData;
    }
    if(!surveyStructure){
        surveyStructure = await my.ajax.operativo_estructura({operativo:operativo});
        my.setLocalVar('estructura-'+operativo, surveyStructure);
    }
    
    var {toDisplay} = myOwn.displayFormCommonPart(surveyManager, formId, formData, navigationStack);
    my.wScreens.proc.result.desplegarFormulario(surveyStructure,main_layout,surveyData,formId, myForm, toDisplay); //MODIFICADO
};