# koishi-mcx-chatsun基本介绍

chatsun一款基于 Langchain 框架构建的角色扮演 AI 对话插件。chatsun将针对“真实的角色扮演”这一目标进行设计，具体来说，chatsun将一个角色视为一个单独的个体，chatsun的所有功能模块都是为了强化该个体的能力上限，为此，

## chatsun将提供以下功能模块：

### 系统预设
系统用于限制ai的回复模式,破限，文风等设定都在此实现，您可以在 **koishi-app/external/chatsun/src/langchain/prompt/presets** 中新建 TXT 文件并编写您的预设，一个角色只能启用一个预设文件

### 人物预设
人物预设用于定义角色的人设，在 **koishi-app/external/chatsun/src/langchain/prompt/character**中新建 TXT 文件并编写您的人设文件，一个角色只能启用一个人设文件

### 知识库
知识库是一个用于存储大量信息的重要功能。如果将所有内容都交给 AI 处理，不仅会占用大量 Token，效果也可能不尽如人意。因此，在遇到大量资料时，建议将其存放于知识库中。当用户提问与知识库中的内容相关时，插件会自动从知识库提取相关信息，并将其作为 Prompt 的一部分传递给 AI，从而使 AI 更准确地理解问题，在 **koishi-app/external/chatsun/src/langchain/prompt/knowledge** 中新建知识库文件夹，并在知识库文件夹内新建txt文件来编写知识库，知识库文件夹内允许创建多个txt文件。一个角色只能启用一个知识库文件夹。

### 角色记忆独立机制
每一个角色都拥有独立的记忆，记忆挂载在角色本身，所以不论角色在什么地方，其记忆文件都是同一个，并且角色将可以识别和他对话的人。



# chatsun版本更新日志
目前chatsun仍在开发中，在1.0版本之前，基本不可用。

### 0.1：将对话的基础模块构建完成。
### 0.2：修复了预设及知识库文件夹位置错误的bug
