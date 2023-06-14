# OpenFn Prototype for MSF LIME Project

Automating data exchange workflows between `DHIS2`, `OpenMRS`, and `OC`L. 

*Note that commits to `main` will be auto-deployed to OpenFn.org. Always work on a branch!*

## Working with the Repo

1. Clone the repo to work with it locally
2. Locally create `/tmp` folder locally with a `state.json` file that you don't commit to github
3. start writing and testing jobs locally with the relevant adaptor

## Workflows Implemented
For the `LIME-PROJECT` two workflows were prototyped on OpenFn.org (the hosted OpenFn platform `v1`). 
- See below diagrams for a functional overview, or see [the diagrams](./diagrams) directory for the technical versions of these diagrams, which also detail the specific API steps. 
- See [this document]() for the data element mapping specifications, which detail how specific data points are mapped between systems. 

### Workflow 1: One-way migration of DHIS2 patients to OpenMRS for the initial setup
![workflow1](./diagrams/MSF-LIME%20OpenFn%20Workflow%201.png)

### Workflow 2: Ongoing sync of new/updated OpenMRS data to DHIS2 for program monitoring & reporting 
![workflow2](./diagrams/MSF-LIME%20OpenFn%20Workflow%202.png)

#### Dynamically exporting mappings from OCL 
In Workflow 2, there is a step to dynamically export mapping specifications from OCL. See below diagram for an overview of how this works. In the prototype, this was implemented for the attributes `Entry triage color` and `Final diagnosis`
![workflow2](./diagrams/MSF-LIME%20Project%20Demo%20Solution%20Diagram.png)
