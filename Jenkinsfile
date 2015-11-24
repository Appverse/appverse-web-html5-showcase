def jobName = "${env.JOB_NAME}"
def jenkinsHome = "${env.JENKINS_HOME}"

def Properties props = new Properties()
def File propertiesFile 

if ( jobName.startsWith("develop") )
	propertiesFile = new File(jenkinsHome + '/jobs/' + jobName + '/workspace@script/Jenkinsfile.properties')
else
{
	def pos = jobName.indexOf ( "/" )
	def firstPartJob = jobName.substring ( 0,  pos);
	def secondPartJob = jobName.substring ( pos + 1);

	propertiesFile = new File(jenkinsHome + '/jobs/' + firstPartJob + '/branches/' + secondPartJob + '/workspace@script/Jenkinsfile.properties')
}

props.load(propertiesFile.newDataInputStream())


node('docker'){
	def branchName = currentBranch()
	
	def applicationRepo = props.applicationRepo
	def credentials = props.credentials
	def dataVolume = props.dataVolume
	def distFolder = props.distFolder
	def workspaceNode = props.workspaceNode
	
	def dockerImageName = props.dockerImageName
	def dockerContainerName = props.dockerContainerName
	def contextPath = props.contextPath
	def host= props.host
	def sonarHost = props.sonarHost
	def sonarJdbc = props.sonarJdbc
	def port = props.port
	
	def developmentHost = props.developmentHost
	def registryPort = props.registryPort
	
	def enableBinaryArchive = props.enableBinaryArchive.toBoolean()
	def enableTestResultArchive = props.enableTestResultArchive.toBoolean()
	def enableE2ETesting = props.enableE2ETesting.toBoolean()
	def enableStressTesting = props.enableStressTesting.toBoolean()
	def enableSecurityTesting = props.enableSecurityTesting.toBoolean()
	def enableSCA = props.enableSCA.toBoolean()
	def enableMashupReporting = props.enableMashupReporting.toBoolean()
	
	def enableDeploy = props.enableDeploy.toBoolean()
	def enableTagRelease = props.enableTagRelease.toBoolean()
	def enableNextSnapshot = props.enableNextSnapshot.toBoolean()
	def deployUserName = props.deployUserName
	def deployMail = props.deployMail
	
	def enableBuildImage = props.enableBuildImage.toBoolean()
	//enableDeployCI = true requires buildImage must be true too
	def enableDeployCI = props.enableDeployCI.toBoolean()
	//enableRegistryPublish = true requires enableBuildImage must be true too
	def enableRegistryPublish = props.enableRegistryPublish.toBoolean()
	//enableDeployDev = true requires enableRegistryPublish must be true too
	def enableDeployDev = props.enableDeployDev.toBoolean()
	def deploymentJob = props.deploymentJob
	def deploymentUrl = props.deploymentUrl
	
	def image
	def version = null
	def registryHost = developmentHost + ':' + registryPort
	
	stage 'clean'
	//clean job workspace
	sh 'sudo rm -rf * && sudo rm -rf .git && sudo rm -fr .tmp && sudo rm -fr .sonar'
	//remove everything except node_modules, app/bower_components and folders starting with dot
	//sh 'sudo find . ! -path \"./node_modules*\" ! -path \"./app/bower_components*\" ! -path \"./.*\"  ! -name \"app\" -print'
	//sh 'sudo find . ! -path \"./node_modules*\" ! -path \"./app/bower_components*\" ! -path \"./.*\"  ! -name \"app\" -delete'
	//remove .git
	//sh 'sudo rm -rf .git'
	//sh 'sudo rm -rf .tmp'
	
	stage 'build'
	//Run build inside maven container
	//docker.image('digitallyseamless/nodejs-bower-grunt').inside('-v '+ workspaceNode + ':' + workspaceNode + ' -v ' + dataVolume + ":" + dataVolume + ' -v /data/node_modules:/usr/local/lib/node_modules -u=\"root\"' )
	docker.image('digitallyseamless/nodejs-bower-grunt').inside('-v '+ workspaceNode + ':' + workspaceNode + ' -v ' + dataVolume + ":" + dataVolume + ' -v ' + dataVolume + '/npm_cache:/root/.npm -u=\"root\"')
	{
		configureSshKeys ( dataVolume )
				
		if ( isDevelopBranch( branchName ) )
		{
			echo "Branch Develop"
			git branch: branchName, credentialsId: credentials, changelog: true, poll: false, url: applicationRepo
			version = getVersion()
			echo "Version " + version
			//version = getVersion()
			//echo "Version " + versionOld + " changed to: " + version
			
		}
		//multibranch job
		else
		{
			checkout scm
			version = getVersion()
			echo "Version " + version
		}
		
		try
		{
			sh 'git config --global url.\"git@github.com:\".insteadOf git://github.com/'  
			//sh 'npm install -g bower grunt-cli'
			sh 'npm install'
			sh 'bower install'
			sh 'grunt test:unit'
			sh 'grunt dist'
		}
		finally
		{
			if ( enableBinaryArchive )
				archive 'dist/web/**'
			if (enableTestResultArchive)
				step([$class: 'JUnitResultArchiver', testResults: 'test/unit/*.xml'])
		}
		
	}
	


	
	
	if ( enableBuildImage )
	{
		stage name: 'package', concurrency: 1
			image = docker.build(dockerImageName + ":" + version)
			try {
				sh "docker stop " + dockerContainerName
				sh "docker rm " + dockerContainerName
			} catch (Exception _) {
				echo "no container to stop"
			}
	}
	else
		echo "Build image disabled"
	   
	if ( enableDeployCI && enableBuildImage )
	{
		stage name: 'deploy to CI', concurrency: 1
		
			def environment = 'ci'
			image.run("--name " + dockerContainerName + " -p " + port + ":80 -v " + dataVolume + ":" + dataVolume + " -e 'profile=" + environment + "'")
	
			echo "Application deployed on http://" + host + ":" + port + "/" + contextPath + "/"
	}
	else
		echo "Deploy CI disabled"
	
	
	if ( enableE2ETesting )
	{
		stage name: 'E2E Testing', concurrency: 1
		
		// clone e2e project from git
		// launch against CI environment using Maven
		//
		//
	}
	else
	  echo "E2E Testing disabled"
	
	if ( enableStressTesting )
	{
		stage name: 'Stress Test', concurrency: 1
		
		//
		// A lot of work...
		//
	}
	else
	  echo "Stress Testing disabled"
	
	
	if ( enableSecurityTesting )
	{
		stage name: 'Security Test', concurrency: 1
		
		  docker.image('infoslack/arachni').inside('-v ' + dataVolume + ":" + dataVolume)
		  {
			//sh "arachni http://172.22.4.39:8083/tseo-rest/api --output-verbose --plugin=autologin:url=http://172.22.4.39:8085/uaa/login,parameters='username=userlleida&password=userlleida',check='prueba' --report-save-path='/data/reports/report.afr'"
			sh "arachni http://" + host + ":" + port + "/" + contextPath + " --output-verbose --report-save-path='/data/reports/report-ui.afr'"
			sh "arachni_reporter /data/reports/report-ui.afr --reporter=html:outfile=/data/reports/security_report_ui.html.zip"
		  }
	}
	else
		echo "Security Testing disabled"
	
	if ( enableSCA )
	{
		stage name: 'SCA', concurrency: 1
		
			//Run build inside sonarqube-runner container
			//image = docker.image ("pierrevincent/sonar-runner -Dsonar.branch=" + branchName + " -Dsonar.host.url=http://172.22.4.39:9000 -Dsonar.jdbc.url=jdbc:mysql://172.22.4.39:3306/sonar?useUnicode=true&characterEncoding=utf8&rewriteBatchedStatements=true" )
			//image = docker.image ("pierrevincent/sonar-runner")
			//image.run("-v " + workspaceNode + "/" + jobName + ":/data")
	
			try {
				sh "docker stop sonar-runner-" + dockerContainerName
				sh "docker rm sonar-runner-" + dockerContainerName
			} catch (Exception _) {
				echo "no container to stop"
			}
				
			sh "docker run --name=sonar-runner-" + dockerContainerName + " -d -v " + workspaceNode + "/" + jobName + ":/data pierrevincent/sonar-runner -Dsonar.branch=" + branchName + 
				" -Dsonar.host.url=" + sonarHost + " '-Dsonar.jdbc.url=" + sonarJdbc + "'"
			
	}
	else
		echo "SCA Disabled"

	
	if ( enableMashupReporting )
	{
		stage name: 'Mashup Reporting', concurrency: 1
		//
		// Reporting
		
	}
	else
		echo "Mashup Reporting Disabled"

		
	if ( isHotFixBranch (branchName) || isDevelopBranch(branchName) )
	{
		if ( enableDeploy )
		{
			stage name: 'Deploy', concurrency: 1
			
			
			sh 'tar -zcvf ' + distFolder + '/' + dockerContainerName + '-' + version + '.tgz dist/web'
			
			/*
			 * This task is project dependant.
			 * If UI project is deployed as 
			 * 	- docker container: deploy phase is executed in docker push
			 *  - statics in web server: probably best option is tgz dist folder and store .tgz in any repo
			 *  - statics served from server application: package as war and deploy to nexus/artifactory
			 *  - our project is npm component: deploy on npm-registry 
			 */ 
			
			
		}
		else
			echo "Maven Deploy Disabled"
	}
	
	if ( isDevelopBranch(branchName) )
	{
		if (enableTagRelease || enableNextSnapshot)
		{
		    //Run build inside maven container
			
			docker.image('digitallyseamless/nodejs-bower-grunt').inside('-v '+ workspaceNode + ':' + workspaceNode + ' -v ' + dataVolume + ":" + dataVolume + ' -v ' + dataVolume + '/npm_cache:/root/.npm -u=\"root\"')
			//docker.image('maven:3.3.3-jdk-8').inside('-v '+ workspaceNode + ':' + workspaceNode + ' -v ' + dataVolume + ":" + dataVolume + ' -u=\"root\"' )
			{
				configureSshKeys ( dataVolume )
				
				if ( enableTagRelease )
				{
					stage name: 'Tag Release', concurrency: 1
					
						tagRelease(version, branchName, deployUserName, deployMail )
				}
				else
					echo "Tag/Release disabled"
	  
				  
				if ( enableNextSnapshot )
				{
					stage name: 'Next Snapshot', concurrency: 1
					
						nextSnapshot(branchName, dataVolume, workspaceNode)
				}
				else
					echo "Next Snapshot disabled"
			}
		}

	}
	
	if ( isHotFixBranch (branchName) || isDevelopBranch(branchName) )
	{
		if ( enableRegistryPublish && enableBuildImage)
		{
			stage name: 'Publish to Registry', concurrency: 1
			
				docker.withRegistry("http://" + registryHost)
				{
					image.push version
					image.push 'latest'
					echo "Application image published in registry " + registryHost
				}
		}
		else
		  echo "Registry publication disabled"
		
		
		if (enableDeployDev && enableBuildImage  && enableRegistryPublish)
		{
			stage name: 'Deploy DEV', concurrency: 1
	
				//Although job is develop-deployment, it will work also with hot-fixes
				//build deploymentJob
				sh 'curl ' + deploymentUrl
		  }
	}
	
	stage 'end clean'
	//clean job workspace
	sh 'sudo rm -rf * && sudo rm -rf .git && sudo rm -fr .tmp && sudo rm -fr .sonar'

}

def configureSshKeys ( dataVolume )
{
	sh 'mkdir ~/.ssh && cp ' + dataVolume + '/.ssh/* ~/.ssh/'
}

def tagRelease(version, branchName, deployUserName, deployMail) {
	
	echo 'Tag Release'
	
		//Set configuration
		sh "git config --local push.default simple"
		sh "git config user.name '" + deployUserName + "'"
		sh "git config user.email '" + deployMail + "'"

		//Delete tag if it exists
		try{
			sh "git tag -d " + version
			sh "git push origin :refs/tags/" + version
		} catch (e)
		{}
  
		  //Create temp branch
		//sh "git checkout -b temp_branch"
		  
		  //Merge changes from develop and commit them
		//sh "git merge origin/" + branchName
		//sh "git commit -a -m 'Next Release " + version + " by jenkins'"
		  
		//Change to develop branch and merge changes from temp
		//sh "git checkout " + branchName
		//sh "git merge temp_branch"
		
		//Push changes to master
		//sh "git push origin " + branchName
		   
		   // Create and push tag
		sh "git tag -f -a " + version + " -m 'Next Release " + version + " by jenkins'"
		sh "git push origin " + version
		 
		 // Delete temporary branch
		//sh "git branch -d temp_branch"
}


def nextSnapshot(branchName, dataVolume, workspaceNode) {
	
	echo 'Next Snapshot'
	
	// Create Temp branch again
	sh "git checkout -b temp_branch"
	
	// Merge changes from develop
	sh "git merge origin/" + branchName
	
	// Bump version
	sh 'grunt release:patch'
	
	def nextSnap = getVersion()
	
	//Commit changes
	sh "git commit -a -m 'Next version " + nextSnap + " by jenkins'"
	
	//Change to develop and merge changes from temp
	sh "git checkout " + branchName
	sh "git merge temp_branch"
 
	//Push changes to develop
	sh "git push origin " + branchName
	
	//Delete temporary branch
	sh "git branch -d temp_branch"
}

def getVersion() {
	def matcher = readFile('package.json') =~ '[^\\-]version[\'"]?\\s*[:=]\\s*[\'"](.+)[\'"]'
	matcher ? matcher[0][1] : null
}

def isDevelopBranch ( jobName ) {
	jobName.startsWith("develop")
}

def isHotFixBranch ( jobName ) {
	jobName.startsWith("hotfix")
}

def currentBranch() {
  def jobName = "${env.JOB_NAME}"
  if ( isDevelopBranch(jobName) )
	return "develop"
  else
  {
	  def pos = jobName.indexOf ( "/" )
	  //String.substring is blocked by script-security-plugin. It's needed to active in Jenkins Management
	  //https://issues.jenkins-ci.org/browse/JENKINS-30252
	  return jobName.substring ( pos + 1);
  }
}

def Properties parsePropertiesString(String s) {
	// grr at load() returning void rather than the Properties object
	// so this takes 3 lines instead of "return new Properties().load(...);"
	final Properties p = new Properties();
	p.load(new StringReader(s));
	return p;
}


def currentUser() {
	def userName = "${env.USER}"
    return userName
}