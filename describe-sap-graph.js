const sapGraph = require('./sap-graph-complete.json');


const describeContent = (content, options) => {
    const { selfName } = options;
    const hierarchies = content.filter(elem => elem.type == "hierarchy");
    const entities = content.filter(elem => elem.type == "entity");
    var s = formulateHierarchy(selfName, hierarchies, entities);
    const returnArray = [];
    hierarchies.forEach(({displayName, content}) => {
        //console.log(`displayName: ${displayName}`);
        const selfName = `Node "${deCamelCase(displayName)}"`;
        const { text, array } = describeContent(content, { selfName });
        s += text
        const obj = { name: displayName, content: array }
        returnArray.push(obj)
    })
    entities.forEach(({ displayName }) => {
      returnArray.push({ name: displayName })
    })
    return { text: s, array: returnArray };
}

const getPlural = (word, count) => {
    if (count == 1) {
        return word;
    } else {
        return `${word}s`
    }
}

const deCamelCase = str => {
    return str.replace(/([a-z])([A-Z])/g,'$1 $2')
}

const formatList = list => {
    if (list.length === 0) {
      return ''; // Return an empty string if the list is empty
    } else if (list.length === 1) {
      return list[0]; // Return the only element if there's only one
    } else {
      const lastIndex = list.length - 1;
      const secondToLastIndex = lastIndex - 1;
      const comma = list.length > 2 ? "," : "";
      
      // Join the elements using commas, except for the last two, which are joined with "and"
      const formattedList = list.map((element, index) => {
        if (index === secondToLastIndex) {
          return `${element}${comma} and ${list[lastIndex]}`;
        } else if (index === lastIndex) {
          return ''; // Skip the last element here
        } else {
          return `${element},`;
        }
      });
      
      return formattedList.join(' ');
    }
  }

const displayNameItemize = objects => {
    return formatList(objects.map(obj => deCamelCase(obj.displayName)));
}

const formulateHierarchy = (selfName, hierarchies, entities) => {
    if (hierarchies.length === 0 && entities.length === 0) {
        return `${selfName} is empty. `
    }
    var s = `${selfName} consists of `
    if (hierarchies.length > 0) {
        s += `hierarchy ${getPlural('node', hierarchies.length)} `;
        s += displayNameItemize(hierarchies)
    }
    
    if (entities.length > 0) {
        if (hierarchies.length > 0) s+= " and ";
        s += `entity ${getPlural('node', entities.length)} `
        s += displayNameItemize(entities);
    }
    s += ".\n";
    return s;
}

const {text, array} = describeContent(sapGraph, { selfName: "The SAP Business Graph" });
//console.log(JSON.stringify(array, null, 2));
console.log(text)